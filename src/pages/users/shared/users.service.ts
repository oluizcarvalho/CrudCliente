import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Users} from './users.model';

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

        return this.http.delete(url).pipe(
            catchError(this.handleError),
            map(() => null)
        )
    }

    //Private Methods
    private jsonDataToUsers(jsonData: any[]): Users[] {
        const users: Users[] = [];
        jsonData.forEach(element => users.push(element as Users));
        return users;
    }

    private static jsonDataToUser(jsonData: any): Users {
        return jsonData as Users;
    }

    private static handleError(error: any): Observable<any> {
        return throwError(error);
    }
    //Fim
}
