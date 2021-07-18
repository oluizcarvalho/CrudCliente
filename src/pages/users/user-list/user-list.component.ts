import {Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {Users} from "../shared/users.model";
import toastr from "toastr"
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: Users[];

  constructor(private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.usersService.getAll().subscribe(
      users => this.users = users,
      error => alert('Erro ao carregar a lista!')
    )
  }

  deleteUser(user) {
    const mustDelete = confirm(`Deseja realmente excluir este usuário "${user.nome}" ?`);

    if (mustDelete) {
      toastr.success("Usuário excluído com sucesso!");
      this.usersService.delete(user.id).subscribe(
        () => this.users = this.users.filter(element => element != user),
        () => alert('Error ao tentar excluir')
      )
    }
  }
}
