export const user = {
  model: {
    singular: "Usuário",
    plural: "Usuários",
  },
  attributes: {
    id: "ID",
    name: "Nome",
    email: "E-mail",
    password: "Senha",
    type: "Tipo",
    typeOptions: ["admin", "operator"],
    createdAt: "Criado em",
    updatedAt: "Atualizado em",
  },
};
