export class Users {
  constructor(
        public id?: number,
        public nome?: string,
        public cpf?: string,
        public cep?: string,
        public logradouro?: string,
        public bairro?: string,
        public localidade?: string,
        public uf?: string
  ) {}
}
