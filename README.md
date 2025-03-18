# CPSC 449 Project: Affordable Groceries

install docker (have docker desktop open)

in terminal run the following:
npm install mysql2
docker build -t my-mysql .
docker run --name mysql-container -p 3307:3306 -d my-mysql
(wait a min so the database can actually initialize)
npm run start:backend 

(if the above does not work plz @ me in discord, these are all the commands you should need. )

for deleting container:
docker stop mysql-container
docker rm mysql-container

to run container after creation
docker start mysql-container


docker stop mysql-container
docker rm mysql-container
docker build -t my-mysql .
docker run --name mysql-container -p 3307:3306 -d my-mysql
docker exec -it mysql-container mysql -u root -p

npm run start:backend 


docker start mysql-container
npm run start:backend 


Note: for db in Stores: Longitude first, then latitude

SELECT 
ST_Distance_Sphere(
    geom_loc,
    POINT(long, lat)
) AS distance_in_meters FROM Store;