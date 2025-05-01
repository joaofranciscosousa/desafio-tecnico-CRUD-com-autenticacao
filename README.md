# Teste para teste de desenvolvedor

Este projeto é um teste prático para a empresa Veracidata. A aplicação tem como objetivo demonstrar uma solução full stack, utilizando Node.js com Express no back-end, e Vue.js com Quasar no front-end. Trata-se de uma aplicação simples, mas com diversas funcionalidades e validações.

## 📃 Pré-requisitos

Antes de iniciar, verifique se possui os seguintes requisitos instalados:

- [`Node`](https://nodejs.org/pt).
- [`MySql`](https://www.mysql.com/) configurado localmente ou via [`Docker`](https://www.docker.com/).
- [`Yarn` (Opicional)](https://classic.yarnpkg.com/lang/en/docs/install)
- Um sistema operacional: `Windows`, `Mac` ou `Linux`.

## ⚙️ Back-end

### 📦 Instalando dependências

Execute no terminal, na raiz do projeto:

```bash
npm install
# ou
yarn install
```

### 🔧 Configuração do banco de dados e variáveis de ambiente

1. Crie uma cópia do arquivo `.env.example` com o nome `.env`. Esse arquivo já vem pré-preenchido com as variáveis necessárias.
2. Para criar as tabelas e inserir os dados iniciais, execute:

```bash
npm run typeorm migration:run
# ou
yarn typeorm migration:run
```

#### 🔐 Credenciais do usuário ADMIN

Após rodar as migrations, um usuário administrador padrão será criado automaticamente com as seguintes credenciais:

E-mail: `admin@email.com`
Senha: `123456789`

### ▶️ Iniciando o servidor

```bash
npm start
# ou
yarn start
```

Para executar os testes unitários:

```bash
npm test
# ou
yarn test
```

## 🖥️ Front-end

### 📦 Instalando dependências

Abra um novo terminal, navegue até a pasta `/frontend`:

```bash
cd ./frontend

npm install
# ou
yarn install
```

### ▶️ Iniciando o front-end

Com o back-end já rodando, execute:

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:9000`. Para realizar o login, use as credenciais do usuário administrador (criadas nas migrations), assim você terá acesso ao CRUD de clintes.

## 🔌 Endpoints da API

Você também pode testar a API utilizando ferramentas como [`Postman`](https://www.postman.com/) ou [`Insomnia`](https://insomnia.rest/).
Base URL: `http://localhost:3000`
Você pode acessar e testar a API diretamente com ferramentas como ou , enviando requisições para , as rotas disponíveis são:

### 📚 Rotas disponíveis:

1. `POST /users/sign_in` - Autenticação;
2. `GET /clients` - Listagem de clientes;
3. `GET /clients/:id` - Busca por um cliente específico;
4. `POST /clients` - Criar novo cliente;
5. `PUT /clients/:id` - Atualizar cliente;
6. `DELETE /clients/:id` - Deletar cliente;
