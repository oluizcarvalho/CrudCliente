import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Users} from "../shared/users.model";
import {switchMap} from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  userForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm: boolean = false;
  user: Users = new Users();

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildUsersForm();
    this.loadUsers();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle()
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.createUsers()
    else
      this.updateUsers()
  }

  //PRIVATE METHODS

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Usuário'
    else {
      const userName = this.user.nome || ''
      this.pageTitle = 'Editando o usuário: ' + userName;
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  private buildUsersForm() {
    this.userForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3)]],
      cpf: [null, [Validators.required]],
      cep: [null, [Validators.required]],
      logradouro: [null, [Validators.required]],
      bairro: [null, [Validators.required]],
      localidade: [null, [Validators.required]],
      uf: [null, [Validators.required]]
    })

  }

  private loadUsers() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.usersService.getById(Number(params.get("id"))))
      )
        .subscribe(
          (user) => {
            this.user = user;
            this.userForm.patchValue(user); // set values on form
          },
          (error) => alert('Ocorreu um error no servidor, tente mais tarde!')
        )
    }
  }

  private createUsers() {
    const user: Users = Object.assign(new Users(), this.userForm.value)
    user.id = this.getIdNext();
    this.usersService.create(user)
      .subscribe(
        user => this.actionsForSuccess(user),
        error => this.actionsForError(error)
      )
  }

  private getIdNext(): number {
    const users: Users[] = JSON.parse(localStorage.getItem("users"))
    return (users && users.length > 0) ? Math.max(...users.map(user => user.id)) + 1 : 1;
  }

  private updateUsers() {
    const user: Users = Object.assign(new Users(), this.userForm.value)

    this.usersService.update(user).subscribe(
      user => this.actionsForSuccess(user),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(user: Users): void {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl('users', {skipLocationChange: true}).then(
      () => this.router.navigate(['users', user.id, 'edit'])
    )
  }

  private actionsForError(error: any): void {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;
    console.error(error);
    if (error.status === 422)
      this.serverErrorMessage = error;
    else
      this.serverErrorMessage = ["Falha na comunicação com o servidor. Por favor, tente mais tarde!"]
  }
}
