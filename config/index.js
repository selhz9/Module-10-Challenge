const { Client } = require('pg');
const { prompt } = require('inquirer');

// Set up PostgreSQL client
const client = new Client({
  user: 'sarahhantz',
  host: 'localhost',
  database: 'employee_tracker',
  password: '',
  port: 5432,
});

client.connect();

// Prompt menu
function promptUser() {
  prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]
    }
  ]).then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
    }
  });
}

// View departments
function viewDepartments() {
  client.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    promptUser(); // Go back to the main menu after displaying data
  });
}

// View roles
function viewRoles() {
    client.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
      console.table(res.rows);
      promptUser();
    });
  }

// View employees
function viewEmployees() {
  client.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    promptUser();
  });
}

// Add a department
function addDepartment() {
  prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter department name:',
    }
  ]).then((answer) => {
    client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
      if (err) throw err;
      console.log('Department added successfully!');
      promptUser();
    });
  });
}

// Add role
function addRole() {
    prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter role title:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter role salary:'
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter department ID for the role:'
      }
    ]).then((answers) => {
      client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
        [answers.title, answers.salary, answers.departmentId], (err, res) => {
          if (err) throw err;
          console.log('Role added successfully!');
          promptUser();
        });
    });
  }  

// Add employee
function addEmployee() {
    prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter employee first name:'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter employee last name:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter role ID for the employee:'
      },
      {
        type: 'input',
        name: 'managerId',
        message: 'Enter manager ID for the employee (optional):'
      }
    ]).then((answers) => {
      client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
        [answers.firstName, answers.lastName, answers.roleId, answers.managerId || null], (err, res) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          promptUser();
        });
    });
  }  

// Update Employee Role
function updateEmployeeRole() {
    prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee to update:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the new role ID for the employee:'
      }
    ]).then((answers) => {
      client.query('UPDATE employee SET role_id = $1 WHERE id = $2', 
        [answers.roleId, answers.employeeId], (err, res) => {
          if (err) throw err;
          console.log('Employee role updated successfully!');
          promptUser();
        });
    });
  }
  

// Start the menu when the application runs
promptUser();

