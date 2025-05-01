const notNullMessageError = (field: string): string => {
  return `O campo ${field.trim()} é obrigatório`;
};

const fieldTypeMessageError = (field: string, type: string): string => {
  return `O campo ${field.trim()} deve ser do tipo ${type.trim()}`;
};

const invalidFieldMessageError = (field: string): string => {
  return `O campo ${field.trim()} é inválido`;
};

export = {
  notNullMessageError,
  fieldTypeMessageError,
  invalidFieldMessageError,
};
