# CPSC 449 Project: Affordable Groceries


install docker (have docker desktop open)

in terminal run the following:
npm install mysql2
docker build -t my-mysql .
docker run --name mysql-container -p 3307:3306 -d my-mysql
npm run start:backend 

Plz note that the first time you run npm run it will give an error bc of initalization. Run it again and it will work.

(if the above does not work plz @ me in discord, these are all the commands you should need. )


docker exec -it mysql-container mysql -u root -p

docker run --name mysql-container -p 3307:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:8 mysqld --mysql-native-password=ON


for deleting container:
docker stop mysql-container
docker rm mysql-container

docker start mysql-container



