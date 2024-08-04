SELECT 
  employee.*, 
  role.title, 
  role.salary, 
  department.name AS department, 
  manager.first_name AS manager_first_name, 
  manager.last_name AS manager_last_name 
FROM employee 
JOIN role ON employee.role_id = role.id 
JOIN department ON role.department_id = department.id 
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;