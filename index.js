const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');
const p = require('./p.json');


// Connect to database
const db = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: p.ass,
    database: 'employee_db'
 },
 console.log(`\x1b[1mConnected to the MySQL database.\x1b[0m`)
);





function menu() {
 inquirer
  .prompt({
      type: 'list',
      message: '\x1b[36mSelect one of the following options:\x1b[0m',
      name: 'next', 
      choices:['View Departments', 'View all Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
    })
  .then((response) => {
    //fs.appendFile(myhtml, generate.generateHTML(response), (error) => error ? console.error(error) : error++);
    cycler(response.next);
  });
}


function sql(sqlcode) {
    // ASYNCHRONOUS Query (query is not async function by default) and rows[0] contains the array of objects of data
    db.promise().query(sqlcode)
          .then((rows, fields) =>{
          if (sqlcode.includes("SELECT")) { console.table(rows[0]); }
          if (sqlcode.includes("INSERT")) { console.log("\x1b[1mNew entry added!\x1b[0m"); }
       })
          .then (() => { menu();
       });
}

function cycler(x) {
  let y;
  switch (x) {
     case 'View Departments':
        sql('SELECT * FROM department ORDER BY id');
     break;
     case 'View all Roles':
        sql('SELECT title,role.id,name AS Department,salary FROM department JOIN role ON department.id=role.department_id;');
     break;
     case 'View Employees':
        inquirer.prompt([{
           type: 'list',
           message: '\x1b[36mHow do you want to view the employees?\x1b[0m',
           name: 'viewby',
           choices:['By Employee ID','By Manager','By Department'],
           },
        ])
        .then((response) => {
          y = "SELECT employee.id, first_name, last_name, title, name AS Department, salary, full_name AS Manager FROM role JOIN department on role.department_id=department.id JOIN employee on role.id=employee.role_id LEFT JOIN manager on manager_id=manager.id "
          if (response.viewby==='By Employee ID') {sql(y + 'ORDER BY employee.id;');
          }
          if (response.viewby==='By Manager') {sql(y + 'GROUP BY full_name;')}
          if (response.viewby==='By Department') {sql(y + 'WHERE name="Biology";')} // might need to loop thru each department for this, + sum salary
        });
     break;
     case 'Add Department':
        y = "INSERT INTO department (name) VALUES ('"
        inquirer.prompt([{
           type: 'input',
           message: '\x1b[36mEnter the New Department name:\x1b[0m',
           name: 'nam',
           validate: isEmpty,
           },
        ])
        .then((response) => {
           y += response.nam;
           y += "');"
           sql(y);
        });
     break;
     case 'Add Role':
        y = "INSERT INTO role (title, salary, department_id) VALUES (";
        db.promise().query('SELECT * FROM department').then( function (rows) { rows[0].forEach(function (i) {i.value = i.id; delete i.id;}); 
        inquirer.prompt([{
           type: 'input',
           message: '\x1b[36mEnter the New Role name:\x1b[0m',
           name: 'title',
           validate: isEmpty,
           },
           {
           type: 'input',
           message: '\x1b[36mEnter the salary:\x1b[0m',
           name: 'salary',
           validate: isNumber,
           },
           {
           type: 'list',
           message: '\x1b[36mEnter the department:\x1b[0m',
           name: 'dept', 
           choices: rows[0],
           },
        ])
        .then((response) => { 
           y += `"${response.title}", ${response.salary}, ${response.dept}`;
           y += ");"
           sql(y);
        });
        });
     break;
     case 'Add Employee':  
      
     break;
     default: console.log("\x1b[1mFinished.\x1b[0m");
     process.exit();
  }
}

async function isNumber(x) {
   if (isNaN(Number(x))) {return '\x1b[1mMust input a number!\x1b[0m';}
   return true;
}

async function isEmpty(x) {
   if (x.trim() == '') {return '\x1b[1mInput cannot be empty!\x1b[0m';}
   return true;
}

/*
inquirer
  .prompt([
    {
      type: 'input',
      message: '> Enter the name of the ENGINEER.',
      name: 'name',
    },
    {
      type: 'input',
      message: '> Enter the ID number of the ENGINEER.',
      name: 'id',
      validate: isNumber,
    },
    {
      type: 'input',
      message: '> Enter the email of the ENGINEER.',
      name: 'email',
      validate: isEmail,
    },
    {
      type: 'input',
      message: '> Enter the github username of the ENGINEER.',
      name: 'github',
    },
    {
      type: 'list',
      message: '> Enter the next team member:',
      name: 'next', 
      choices:['Engineer', 'Intern', 'End'],
    },
  ])
  .then((response) => {
    let engineer = new Engineer(response.name, response.id, response.email, response.github);
    fs.appendFile(myhtml, generate.generateHTML(response), (error) => error ? console.error(error) : error++);
    cycler(response.next);
  });
*/
menu();