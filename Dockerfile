FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=Grocery

EXPOSE 3308
COPY init.sql /docker-entrypoint-initdb.d/
