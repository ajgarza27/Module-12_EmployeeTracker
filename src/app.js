// Load environment variables from .env file
require('dotenv').config();
const inquirer = require('inquirer');
const db = require('.././src/queries/trackerqueries');
require('console.table');

// Main menu function
const mainMenu = async () => {
  try {
    const { action } = await inquirer.prompt([
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
          'Update an employee role',
          'Update employee manager',
          'View employees by manager',
          'View employees by department',
          'Delete department',
          'Delete role',
          'Delete employee',
          'View department budget',
          'Exit'
        ]
      }
    ]);

    console.log(`Selected action: ${action}`);
    switch (action) {
      case 'View all departments':
        const departments = await db.fetchAllDepartments();
        console.table(departments);
        break;
      case 'View all roles':
        const roles = await db.fetchAllRoles();
        console.table(roles);
        break;
      case 'View all employees':
        const employees = await db.fetchAllEmployees();
        console.table(employees);
        break;
      case 'View employees by manager':
        await viewEmployeesByManager();
        break;
      case 'View employees by department':
        await viewEmployeesByDepartment(); 
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Update employee manager':
        await updateEmployeeManager();
        break;
      case 'Delete department':
        await deleteDepartment();
        break;
      case 'Delete role':
        await deleteRole();
        break;
      case 'Delete employee':
        await deleteEmployee();
        break;
      case 'View department budget':
        await viewDepartmentBudget();
        break;
      case 'Exit':
        console.log('Goodbye!');
        process.exit();
    }
    await mainMenu();

  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to add a new department
const addDepartment = async () => {
  console.log('Adding a department');
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:'
    }
  ]);
  await db.createDepartment(name);
  console.log(`Added department ${name}`);
};

// Function to add a new role
const addRole = async () => {
  console.log('Adding a role');
  const departments = await db.fetchAllDepartments();
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the role:'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role:',
      choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
    }
  ]);
  await db.createRole(title, salary, department_id);
  console.log(`Added role ${title}`);
};

// Function to add a new employee
const addEmployee = async () => {
  console.log('Adding an employee');
  const roles = await db.fetchAllRoles();
  const employees = await db.fetchAllEmployees();
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the employee:'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the employee:'
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role for the employee:',
      choices: roles.map(role => ({ name: role.title, value: role.id }))
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager for the employee:',
      choices: [{ name: 'None', value: null }, ...employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))]
    }
  ]);
  await db.createEmployee(first_name, last_name, role_id, manager_id);
  console.log(`Added employee ${first_name} ${last_name}`);
};

// Function to update an employee's role
const updateEmployeeRole = async () => {
  console.log('Updating an employee role');
  const employees = await db.fetchAllEmployees();
  const roles = await db.fetchAllRoles();
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role for the employee:',
      choices: roles.map(role => ({ name: role.title, value: role.id }))
    }
  ]);
  await db.modifyEmployeeRole(employee_id, role_id);
  console.log(`Updated employee role`);
};

// Function to update an employee's manager
const updateEmployeeManager = async () => {
  console.log('Updating an employee manager');
  const employees = await db.fetchAllEmployees();
  const { employee_id, manager_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the new manager for the employee:',
      choices: [{ name: 'None', value: null }, ...employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))]
    }
  ]);
  await db.modifyEmployeeManager(employee_id, manager_id);
  console.log(`Updated employee manager`);
};

// Function to view employees by manager
const viewEmployeesByManager = async () => {
  const employees = await db.fetchEmployeesByManager();
  console.table(employees);
};

// Function to view employees by department
const viewEmployeesByDepartment = async () => {
  const employees = await db.fetchEmployeesByDepartment();
  console.table(employees);
};

// Function to delete a department
const deleteDepartment = async () => {
  const departments = await db.fetchAllDepartments();
  const { department_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department to delete:',
      choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
    }
  ]);
  await db.removeDepartment(department_id);
  console.log(`Deleted department`);
};

// Function to delete a role
const deleteRole = async () => {
  const roles = await db.fetchAllRoles();
  const { role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role to delete:',
      choices: roles.map(role => ({ name: role.title, value: role.id }))
    }
  ]);
  await db.removeRole(role_id);
  console.log(`Deleted role`);
};

// Function to delete an employee
const deleteEmployee = async () => {
  const employees = await db.fetchAllEmployees();
  const { employee_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to delete:',
      choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
    }
  ]);
  await db.removeEmployee(employee_id);
  console.log(`Deleted employee`);
};

// Function to view department budget
const viewDepartmentBudget = async () => {
  const departments = await db.fetchAllDepartments();
  const { department_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department to view its budget:',
      choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
    }
  ]);
  const budget = await db.fetchDepartmentBudget(department_id);
  console.table(budget);
};

// Start the application by displaying the main menu
mainMenu();