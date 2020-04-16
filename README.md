**Prova Prática CAEd - UFJF**

Pacotes necessários para execução:

- NPM
- NodeJS
- mongoDB


Executando a aplicação:

1. **Instalando Dependências**

- Acesse o diretório raiz e instale as dependências.

```Shell
$ cd prova_pratica_caed
$ npm install
```

2. **Configurando Banco de Dados**

- Inicie o servidor mongoDB.
```Shell
$ mongo
```
- Caso o MongoDB instalado necessite de credenciais, adicione o usuário e senha nos arquivos __.env__ e __.test.env__. Se não, pode ser mantido a configuração. 


2. **Executando a aplicação**

- Para executar os testes.
```Shell
# Utiliza credenciais do .test.env para o banco de dados.
# Realiza os testes com Jest.

$ npm run test 
```

- Para executar em modo produção ou desenvolvedor.
```Shell
# Utiliza credenciais do .env para o banco de dados.
# Executa com o Node.js.
$ npm start 

# Utiliza credenciais do .test.env para o banco de dados.
# Executa com o nodemon.
$ npm run dev 
```