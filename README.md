# Content Management System for Employees
Manage employees via console interaction with a MySQL database
## Description
Add, view, remove, and edit an employee database, including departments and job titles. Created via node.js using the inquirer and mysql2 packages. Console.table is used to show tables in the console.
## Installation Instructions
Before launching the program you must edit index.js to include the credentials for your MySQL server. It is near the top of the script so you don't have to scroll down and look for it. You will also have to install any relevant npm packages. In the console you must navigate to the folder containing the index.js and package.json files, and type the console command 'npm i'. After installing those packages, type 'node index.js' to launch the program.
## How to use
In order to view and edit data in the database, you will be prompted with questions, some of which are multiple choice. Use arrow keys to select the choice you want for those questions. Others require you to type out names for new entries and so on. The program will terminate if you input invalid data, such as duplicate department names. In such cases, no data will be changed and you can launch the program again.
## Status
- Mostly finished
- Optional: View by manager
- Optional: Delete functionality
