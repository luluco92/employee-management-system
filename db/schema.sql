-- Drops the inventory_db if it exists currently --
DROP DATABASE IF EXISTS employee_db;
-- Creates the inventory_db database --
CREATE DATABASE employee_db;

-- use employee_db database --
USE employee_db;

CREATE TABLE department (
  -- Creates a numeric column called "id" --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  -- Creates a numeric column called "id" --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);

CREATE TABLE manager ( 
  id INT NOT NULL UNIQUE,
  full_name VARCHAR(30)
);

-- seeding --
INSERT INTO department (name)
VALUES
    ( "Mathematics"),
    ( "Archaeology"),
    ( "Biology"),
    ( "Astronomy");

INSERT INTO role (title, salary, department_id)
VALUES
    ( "Engineer", 11500, 1),
    ( "Intern", 3000, 3),
    ( "Astrologer", 6000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ( "Jim", "Rat", 1, null),
    ( "Ben", "Dover", 3, 1),
    ( "Steve", "McBrosky", 2, 1),
    ( "Brody", "McStevebro", 2, 1);

INSERT INTO manager (id, full_name) SELECT id, CONCAT_WS(' ', first_name, last_name) from employee WHERE manager_id IS NULL;

