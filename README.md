## Prova Prática CAEd - UFJF

### Pacotes necessários para execução:

- NPM
- NodeJS
- mongoDB


### Executando a aplicação:

### 1. **Instalando Dependências**

- Acesse o diretório raiz e instale as dependências.

```Shell
$ cd prova_pratica_caed
$ npm install
```

### 2. **Configurando Banco de Dados**

- Inicie o MongoDB.
```Shell
$ mongod
```
- Caso o MongoDB instalado necessite de credenciais, adicione o usuário e senha nos arquivos __.env__ e __.test.env__. Se não, pode ser mantido a configuração. 


### 3. **Executando a Testes**

- Para executar os testes.

```Shell
# Utilizará credenciais do '.test.env' para o banco de dados
# e serão executados todos os testes, utilizando o Jest.

$ npm test

# Para executar um único teste, ou ocultar os logs exibidos,
# utilize os mesmos atributos que seriam utilizados no Jest,
# inserindo um ou mais comandos após '--', por exemplo:

$ npm test --  __tests__/unit/invalid_corrections.test.js
$ npm test --  --silent

```

### 4. **Executando a aplicação**

Será executado por padrão em http://localhost:3000 

- Para executar em ambiente de desenvolvimento.

```Shell
# Utilizará credenciais do '.test.env' para o banco de dados e
# será executado com o nodemon.

# A execução do mock é opcional, irá incluir no banco os
# dados criados no script '__tests__/mocks/first.mock.js'

$ npm run mock 
$ npm run dev 
```

- Para executar em ambiente de produção.

```Shell
# Utilizará credenciais do '.env' para o banco de dados e
# será executado com o Node.js.
$ npm start 
```
