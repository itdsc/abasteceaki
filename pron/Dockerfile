# Usar a imagem oficial do MySQL
FROM mysql:5.7

# Definir variáveis de ambiente
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=nome_do_banco
ENV MYSQL_USER=usuario
ENV MYSQL_PASSWORD=senha

# Expor a porta padrão do MySQL
EXPOSE 3306

# Comando para iniciar o MySQL
CMD ["mysqld"]
