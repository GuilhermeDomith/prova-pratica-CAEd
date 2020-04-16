**Prova Prática CAEd - UFJF**

## Pacotes necessários para execução:

- NPM
- NodeJS
- mongoDB


## Executando a aplicação:

### 1. **Instalando Dependências**

- Acesse o diretório raiz e instale as dependências.

```Shell
$ cd prova_pratica_caed
$ npm install
```

### 2. **Configurando Banco de Dados**

- Inicie mongoDB.
```Shell
$ mongod
```
- Caso o MongoDB instalado necessite de credenciais, adicione o usuário e senha nos arquivos __.env__ e __.test.env__. Se não, pode ser mantido a configuração. 


### 2. **Executando a aplicação**

- Para executar os testes.

```Shell
# Utiliza credenciais do .test.env para o banco de dados.
# Realiza os testes com Jest.

$ npm run test

# Para executar um único teste ou ocultar os logs exibidos,
# utilize os mesmos atributos que seriam utilizados no Jest,
# inserindo um ou mais comandos após '--', por exemplo:

$ npm run test --  __tests__/unit/invalid_corrections.test.js
$ npm run test --  --silent

```

- Para executar em modo produção ou desenvolvedor.

```Shell
# Utilizará credenciais do .env para o banco de dados e.
# será executado com o Node.js.
$ npm start 

# Utilizará credenciais do .test.env para o banco de dados e
# será executado com o nodemon.
$ npm run dev 
```
