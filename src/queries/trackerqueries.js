const fs = require('fs');
const path = require('path');
const dbClient = require('../../config/dbConnect');
// Function to read an SQL file and return its content as a string
const readSQLFile = (fileName) => {
  return fs.readFileSync(path.join(__dirname, fileName)).toString();
};
// Function to fetch all departments
const fetchAllDepartments = async () => {
  const query = readSQLFile('fetchAllDepartments.sql');
  const res = await dbClient.query(query);
  return res.rows;
};
// Function to fetch all roles
const fetchAllRoles = async () => {
  const query = readSQLFile('fetchAllRoles.sql');
  const res = await dbClient.query(query);
  return res.rows;
};
// Function to fetch all employees
const fetchAllEmployees = async () => {
  const query = readSQLFile('fetchAllEmployees.sql');
  const res = await dbClient.query(query);
  return res.rows;
};
// Function to fetch employee by manager
const fetchEmployeesByManager = async () => {
  const query = `
    SELECT 
      e1.first_name AS employee_first_name, 
      e1.last_name AS employee_last_name, 
      e2.first_name AS manager_first_name, 
      e2.last_name AS manager_last_name 
    FROM employee e1
    LEFT JOIN employee e2 ON e1.manager_id = e2.id
    ORDER BY e2.first_name, e2.last_name, e1.first_name, e1.last_name
  `;
  const res = await dbClient.query(query);
  return res.rows;
};
// Function to fetch employee by department
const fetchEmployeesByDepartment = async () => {
  const query = `
    SELECT 
      employee.first_name, 
      employee.last_name, 
      department.name AS department
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    ORDER BY department.name, employee.first_name, employee.last_name
  `;
  const res = await dbClient.query(query);
  return res.rows;
};
// Function to create department
const createDepartment = async (name) => {
  const query = 'INSERT INTO department (name) VALUES ($1) RETURNING *';
  const res = await dbClient.query(query, [name]);
  return res.rows[0];
};
// Function to create role
const createRole = async (title, salary, department_id) => {
  const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *';
  const res = await dbClient.query(query, [title, salary, department_id]);
  return res.rows[0];
};
// Function to creat employee
const createEmployee = async (first_name, last_name, role_id, manager_id) => {
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
  const res = await dbClient.query(query, [first_name, last_name, role_id, manager_id]);
  return res.rows[0];
};
// Function to edit employee
const modifyEmployeeRole = async (employee_id, role_id) => {
  const query = 'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *';
  const res = await dbClient.query(query, [role_id, employee_id]);
  return res.rows[0];
};
// Function to edit employee manager
const modifyEmployeeManager = async (employee_id, manager_id) => {
  const query = 'UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *';
  const res = await dbClient.query(query, [manager_id, employee_id]);
  return res.rows[0];
};
// Function set manager to null for employees
const setManagerToNullForEmployees = async (manager_id) => {
  const query = 'UPDATE employee SET manager_id = NULL WHERE manager_id = $1 RETURNING *';
  const res = await dbClient.query(query, [manager_id]);
  return res.rows;
};
// Function to remome employee by role
const removeEmployeesByRoleId = async (role_id) => {
  const query = 'DELETE FROM employee WHERE role_id = $1 RETURNING *';
  const res = await dbClient.query(query, [role_id]);
  return res.rows;
};
// Function to remove roles by department
const removeRolesByDepartmentId = async (department_id) => {
  // Get all roles by department_id
  const queryGetRoles = 'SELECT id FROM role WHERE department_id = $1';
  const rolesRes = await dbClient.query(queryGetRoles, [department_id]);

  // Delete employees for each role
  for (let role of rolesRes.rows) {
    await removeEmployeesByRoleId(role.id);
  }

  // Delete roles
  const query = 'DELETE FROM role WHERE department_id = $1 RETURNING *';
  const res = await dbClient.query(query, [department_id]);
  return res.rows;
};
// delete roles and employees first
const removeDepartment = async (id) => {
  await removeRolesByDepartmentId(id); 
  const query = 'DELETE FROM department WHERE id = $1 RETURNING *';
  const res = await dbClient.query(query, [id]);
  return res.rows[0];
};
// delete employees first
const removeRole = async (id) => {
  await removeEmployeesByRoleId(id);
  const query = 'DELETE FROM role WHERE id = $1 RETURNING *';
  const res = await dbClient.query(query, [id]);
  return res.rows[0];
};
// Set manager_id to NULL for employees refrence employee
const removeEmployee = async (id) => {
  await setManagerToNullForEmployees(id); 
  const query = 'DELETE FROM employee WHERE id = $1 RETURNING *';
  const res = await dbClient.query(query, [id]);
  return res.rows[0];
};
// function to get budget
const fetchDepartmentBudget = async (department_id) => {
  const query = `
    SELECT 
      department.name AS department,
      SUM(role.salary) AS total_budget
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    WHERE department.id = $1
    GROUP BY department.name
  `;
  const res = await dbClient.query(query, [department_id]);
  return res.rows[0];
};

module.exports = {
  fetchAllDepartments,
  fetchAllRoles,
  fetchAllEmployees,
  fetchEmployeesByManager,
  fetchEmployeesByDepartment,
  createDepartment,
  createRole,
  createEmployee,
  modifyEmployeeRole,
  modifyEmployeeManager,
  removeDepartment,
  removeEmployeesByRoleId,
  removeRolesByDepartmentId,
  removeRole,
  removeEmployee,
  fetchDepartmentBudget,
};