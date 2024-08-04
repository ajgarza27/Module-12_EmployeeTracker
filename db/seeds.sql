INSERT INTO department (name)
VALUES ('Engineering'), ('Finance'), ('Legal'), ('Accounting'), ('IT');

INSERT INTO role (title, salary, department_id)
VALUES 
  ('Software Engineer', 80000, 1),
  ('Accountant', 60000, 2),
  ('Lawyer', 90000, 3),
  ('Acct Manager', 75000, 4),
  ('IT Manager', 95000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('Alyssa', 'South', 1, NULL),
  ('Alanna', 'Johnson', 2, NULL),
  ('Jim', 'Johnson', 3, NULL),
  ('Jimbo', 'Zeus', 4, NULL),
  ('Jake', 'Wheeler', 5, NULL);