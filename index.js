const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');

// Connect to database
const db = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: p.ass,
    database: 'employee_db'
 },
 console.log(`\x1b[1mConnected to the MySQL database.\x1b[0m`)
);


const deptarray = [];


function menu() {
 inquirer
  .prompt({
      type: 'list',
      message: '\x1b[36mSelect one of the following options:\x1b[0m',
      name: 'next', 
      choices:['View Departments', 'View all Roles', 'View Employees', 'Add New Entry', 'Edit Employee', 'Delete Entry', 'Exit'],
    })
  .then((response) => {
    //fs.appendFile(myhtml, generate.generateHTML(response), (error) => error ? console.error(error) : error++);
    cycler(response.next);
  });
}

function updateManagerTable() {
    db.promise().query('TRUNCATE TABLE manager').then((rows) => {
          db.promise().query("INSERT INTO manager (id, full_name) SELECT id, CONCAT_WS(' ', first_name, last_name) from employee WHERE manager_id IS NULL").then((rows) => { 
          });
       });
}

function deptsalary(d) {
    db.promise().query(`select SUM(salary) AS sum FROM role JOIN department on role.department_id=department.id JOIN employee on role.id=employee.role_id where department_id=${d}`).then( (rows) => { console.log(`Total payout for this Department: ${rows[0][0].sum}`); })
    //.then(() => setTimeout(menu, 1000));
}

function sql(sqlcode, option) {
    // ASYNCHRONOUS Query (query is not async function by default) and rows[0] contains the array of objects of data
    db.promise().query(sqlcode).then((rows) => {
          if (sqlcode.includes("SELECT")) { console.table(rows[0]); }
          if (sqlcode.includes("INSERT")) { console.log("\x1b[1mNew entry added!\x1b[0m"); }
          if (sqlcode.includes("UPDATE")) { console.log("\x1b[1mEmployee info updated!\x1b[0m"); }
          if (option === -1) { updateManagerTable();}
          if (option > 0) { deptsalary(option);}
       })
          .then (() => { setTimeout(menu, 1000) //menu();
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
          if (response.viewby==='By Manager') {console.log("\x1b[1mSorry. This feature isn't available for free users.\x1b[0m");menu();}
          if (response.viewby==='By Department') {
              db.promise().query('SELECT * FROM department').then( function (rows) { rows[0].forEach(function (i) {i.value = i.id; delete i.id;}); 
              inquirer.prompt([{
           type: 'list',
           message: '\x1b[36mChoose department:\x1b[0m',
           name: 'dept', 
           choices: rows[0],
           },
              ])
             .then((response) => { 
                y += `WHERE department_id = ${response.dept}`;
                sql(y,response.dept);
             }); 
        });}
       });
     break;
     case 'Edit Employee': // option to edit manager too
           y = "UPDATE employee SET ";
           inquirer.prompt([{
                type: 'list',
                message: "\x1b[36mWhich option?:\x1b[0m",
                name: 'edit',
                choices:["Edit Employee's Role","Edit Employee's Manager"],
               },
           ])
           .then((response) => {
           if (response.edit === "Edit Employee's Role") {
           db.promise().query('SELECT id,title FROM role').then( function (rows) { rows[0].forEach(function (i) {i.value = i.id; delete i.id; i.name = i.title; delete i.title;});
            inquirer.prompt([{
                type: 'input',
                message: "\x1b[36mEnter the Employee's FIRST NAME:\x1b[0m",
                name: 'first',
                validate: isEmpty,
                },
                {
                type: 'input',
                message: "\x1b[36mEnter the Employee's LAST NAME:\x1b[0m",
                name: 'last',
                validate: isEmpty,
                },
           {
           type: 'list',
           message: "\x1b[36mChoose the Employee's new role:\x1b[0m",
           name: 'role', 
           choices: rows[0],
           },
        ])
        .then((response) => {
           y += `role_id = ${response.role} WHERE first_name = "${response.first}" AND last_name = "${response.last}"`;
           sql(y);
        });
       });
}

           if (response.edit === "Edit Employee's Manager") {
           db.promise().query('SELECT id,full_name FROM manager').then( function (rows) { rows[0].forEach(function (i) {i.value = i.id; delete i.id; i.name = i.full_name; delete i.full_name;});
            inquirer.prompt([{
                type: 'input',
                message: "\x1b[36mEnter the Employee's FIRST NAME:\x1b[0m",
                name: 'first',
                validate: isEmpty,
                },
                {
                type: 'input',
                message: "\x1b[36mEnter the Employee's LAST NAME:\x1b[0m",
                name: 'last',
                validate: isEmpty,
                },
           {
           type: 'list',
           message: "\x1b[36mChoose the Employee's new manager:\x1b[0m",
           name: 'boss', 
           choices: rows[0],
           },
        ])
        .then((response) => {
           y += `manager_id = ${response.boss} WHERE first_name = "${response.first}" AND last_name = "${response.last}"`;
           sql(y); // hehe you can't get promoted to be a manager in this program
        });
       });
}            
       });

     break;
     case 'Delete Entry':  
      console.log("\x1b[1mSorry. This feature isn't available for free users.\x1b[0m");menu();
     break;
     case 'Add New Entry':  
         inquirer.prompt([{
           type: 'list',
           message: '\x1b[36mAdd which?\x1b[0m',
           name: 'viewby',
           choices:['Add Department','Add Role','Add Employee','Back'],
           },
        ])
        .then((response) => {
            if (response.viewby==='Add Department') {
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
          }
          if (response.viewby==='Add Role') {
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
           message: '\x1b[36mChoose department:\x1b[0m',
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
          }
          if (response.viewby==='Add Employee') {
           y = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (";
           db.promise().query('SELECT * FROM manager').then( function (mrows) { mrows[0].forEach(function (i) {i.value = i.id; delete i.id;i.name = i.full_name; delete i.full_name;});mrows[0].unshift({value:"null", name:"This employee is a manager"});
           db.promise().query('SELECT * FROM role').then( function (rows) { rows[0].forEach(function (i) {i.value = i.id; delete i.id; i.name = i.title; delete i.title;}); 
           inquirer.prompt([{
                type: 'input',
                message: "\x1b[36mEnter the Employee's first name:\x1b[0m",
                name: 'first',
                validate: isEmpty,
                },
                {
                type: 'input',
                message: "\x1b[36mEnter the Employee's last name:\x1b[0m",
                name: 'last',
                validate: isEmpty,
                },
                {
                type: 'list',
                message: "\x1b[36mChoose the Employee's role:\x1b[0m",
                name: 'role',
                choices: rows[0],
                },
                {
                type: 'list',
                message: "\x1b[36mChoose the Employee's manager:\x1b[0m",
                name: 'boss',
                choices: mrows[0],
                },
           ])
            .then((response) => { 
            y += `"${response.first}", "${response.last}", ${response.role}, ${response.boss})`; 
               sql(y,-1);
            
            });
           });
          });
          }
          if (response.viewby==='Back') {menu();}
        });
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

menu();
