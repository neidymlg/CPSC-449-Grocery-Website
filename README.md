# CPSC 449 Project: Affordable Groceries

As a passionate team of CSUF (California State University, Fullerton) students,
we endeavor to provide you with the best
deals and ensure you get the most value for your money.  

Affordable Groceries seeks to help you find the most affordable items,
by listing the cheapest items from different stores. We aim to make sure that you can get the best
foods at the best prices. We want you to eat healthy without breaking the bank. We hope you enjoy your shopping experience with us!

## Installation and Set Up

Run `npm install` in both the root and `client` directories. \
Then run `npm run dev` in the root directory.

## Instructions for starting Docker for Website 
docker build -t my-mysql . 
docker run --name mysql-container -p 3308:3306 -d my-mysql 
docker exec -it mysql-container mysql -u root -p

### Instructions for Deleting Docker 
docker stop mysql-container     
docker rm mysql-container 