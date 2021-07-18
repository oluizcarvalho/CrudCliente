import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Users} from './users.model';
import {tryCatch} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiPath: string = "api/users"

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Users[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUsers)
    )
  }

  getById(id: number): Observable<Users> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUser)
    )
  }

  create(user: Users): Observable<Users> {
    return this.http.post(this.apiPath, user).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUser)
    )
  }

  update(user: Users): Observable<Users> {
    const url = `${this.apiPath}/${user.id}`;

    return this.http.put(url, user).pipe(
      catchError(this.handleError),
      map(() => user)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    //delete on localStorage
    try {
      const localStorageUsers: Users[] = JSON.parse(localStorage.getItem("users"));
      const indexOfRemove = localStorageUsers.findIndex(a => a.id == id);
      localStorageUsers.splice(indexOfRemove);
      localStorage.setItem("users", JSON.stringify(localStorageUsers));
    } catch (e) {
      this.handleError(e);
    }

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //Private Methods
  private jsonDataToUsers(jsonData: any[]): Users[] {
    const users: Users[] = [];
    jsonData.forEach(element => users.push(element as Users));
    localStorage.setItem("users", JSON.stringify(users));
    return users;
  }

  private jsonDataToUser(jsonData: any): Users {
    return jsonData as Users;
  }

  private handleError(error: any): Observable<any> {
    return throwError(error);
  }

  //Fim
}
