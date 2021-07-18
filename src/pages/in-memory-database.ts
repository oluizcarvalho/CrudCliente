import {InMemoryDbService} from "angular-in-memory-web-api";
import {Users} from "./users/shared/users.model";

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    let users: Users[] = [
        {id: 1, bairro: "Aeroporto", cep: "38770000", cpf: "12280970627", localidade: "João Pinheiro", uf: "MG", logradouro: "Benedito de Souza Caldeira 1347", nome: "Luiz Carvalho"}
    ];
    const localStorageUsers: Users[] = JSON.parse(localStorage.getItem("users"))
    if (localStorageUsers != null && localStorageUsers.length > 0){
      users = localStorageUsers;
    }
    console.log(users)

    return {users}
  }
}
