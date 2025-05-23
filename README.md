# Abastece Aqui

## Como Executar

Este projeto possui um backend que usa um banco de dados MySQL rodando em Docker.

### Passos para iniciar o banco de dados MySQL com Docker

1. Entre na pasta `pron`:

   ```bash
   cd pron

- Construa a imagem Docker para o banco de dados (se você tiver um Dockerfile para isso):

```docker build -t meu-mysql-image .```

- Rode o container usando a imagem criada:

```docker run -d -p 3306:3306 --name meu-mysql-container meu-mysql-image```

- Ou, caso prefira usar a imagem oficial do MySQL diretamente, rode:

    ```docker run -d --name meu-mysql-container -e MYSQL_ROOT_PASSWORD=senha_segura -e MYSQL_DATABASE=meubanco -e MYSQL_USER=meuusuario -e MYSQL_PASSWORD=minhasenha -p 3306:3306 mysql:8.0```

- Após isso, o container do banco de dados estará rodando e acessível via localhost na porta 3306.

Rodando o backend

Na pasta raiz do backend (exemplo: dentro de pron), execute:

```node app.js```

O backend iniciará e se conectará ao banco MySQL.

## Rodando o frontend (Angular) ##

Na pasta do frontend, execute:

```ng serve```

Isso iniciará o servidor de desenvolvimento do Angular.
Observações importantes

    Certifique-se de que seu arquivo .env esteja configurado com as variáveis corretas para conexão com o banco (ex: DB_USER, DB_PASSWORD, DB_HOST, etc).

    Se estiver usando Docker, verifique se o host e porta no .env apontam para o container corretamente.

    Reinicie o backend sempre que fizer mudanças nas variáveis de ambiente.


=====================================
Como Executar:

No back tem um docker file que  gera uma imagem pra o banco de dados

cd dentro de pron
- docker build -t meu-mysql-image .
- docker run -d -p 3306:3306 --name meu-mysql-container meu-mysql-image
- (talvez?) docker run -d --name meu-mysql-container -e MYSQL_ROOT_PASSWORD=senha_segura -e MYSQL_DATABASE=meubanco -e MYSQL_USER=meuusuario -e MYSQL_PASSWORD=minhasenha -p 3306:3306 mysql:8.0

(Container vai estar ativado.)
`http://localhost:3306` 

Então:
- "node app.js" pro back
- "ng serve" pro angular
===================================
