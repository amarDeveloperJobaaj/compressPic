/**
 * Sample databases for the SQL Playground — each is a runnable SQL script
 * that creates tables and inserts realistic rows.
 */

export interface SampleDatabase {
  id: string;
  name: string;
  description: string;
  sql: string;
}

export const SAMPLE_DATABASES: SampleDatabase[] = [
  {
    id: "employees",
    name: "Employees",
    description: "Departments, employees & salaries",
    sql: `CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  salary INTEGER,
  hired_date TEXT
);

INSERT INTO departments (id, name, location) VALUES
  (1, 'Engineering', 'San Francisco'),
  (2, 'Marketing', 'New York'),
  (3, 'Sales', 'Chicago'),
  (4, 'Design', 'Austin');

INSERT INTO employees (id, name, department_id, salary, hired_date) VALUES
  (1, 'Alice Chen', 1, 95000, '2021-03-15'),
  (2, 'Bob Singh', 1, 88000, '2020-07-01'),
  (3, 'Carlos Ruiz', 2, 72000, '2022-01-10'),
  (4, 'Dana White', 3, 69000, '2019-11-20'),
  (5, 'Eve Kumar', 4, 81000, '2021-08-02'),
  (6, 'Frank Osei', 2, 67000, '2023-02-14'),
  (7, 'Grace Lee', 3, 74000, '2020-05-30'),
  (8, 'Hassan Ali', 1, 102000, '2018-09-12');

-- Try me: SELECT d.name, COUNT(e.id) FROM departments d LEFT JOIN employees e ON e.department_id = d.id GROUP BY d.name;`,
  },
  {
    id: "products",
    name: "Products",
    description: "Categories, products & inventory",
    sql: `CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  price REAL,
  stock INTEGER
);

INSERT INTO categories (id, name) VALUES
  (1, 'Electronics'), (2, 'Books'), (3, 'Clothing'), (4, 'Home');

INSERT INTO products (id, name, category_id, price, stock) VALUES
  (1, 'Wireless Mouse', 1, 24.99, 120),
  (2, 'Mechanical Keyboard', 1, 89.99, 45),
  (3, 'JavaScript: The Good Parts', 2, 19.99, 200),
  (4, 'SQL for Beginners', 2, 29.50, 80),
  (5, 'Cotton T-Shirt', 3, 15.00, 300),
  (6, 'Desk Lamp', 4, 39.99, 60),
  (7, 'USB-C Hub', 1, 54.00, 95),
  (8, 'Denim Jacket', 3, 79.00, 25);

-- Try me: SELECT c.name, ROUND(SUM(p.price * p.stock), 2) AS inventory_value FROM products p JOIN categories c ON c.id = p.category_id GROUP BY c.name ORDER BY inventory_value DESC;`,
  },
  {
    id: "orders",
    name: "Orders",
    description: "Customers, orders & order items",
    sql: `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  country TEXT
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date TEXT,
  total REAL
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product TEXT,
  quantity INTEGER,
  price REAL
);

INSERT INTO customers (id, name, email, country) VALUES
  (1, 'Mia Johnson', 'mia@example.com', 'USA'),
  (2, 'Noah Williams', 'noah@example.com', 'UK'),
  (3, 'Olivia Garcia', 'olivia@example.com', 'Spain'),
  (4, 'Liam Brown', 'liam@example.com', 'Canada');

INSERT INTO orders (id, customer_id, order_date, total) VALUES
  (101, 1, '2026-06-01', 149.97),
  (102, 2, '2026-06-03', 59.99),
  (103, 1, '2026-06-10', 24.50),
  (104, 3, '2026-06-15', 210.00),
  (105, 4, '2026-06-20', 89.00),
  (106, 2, '2026-06-25', 39.99);

INSERT INTO order_items (id, order_id, product, quantity, price) VALUES
  (1, 101, 'Wireless Mouse', 2, 24.99),
  (2, 101, 'Keyboard', 1, 99.99),
  (3, 102, 'Notebook', 3, 19.99),
  (4, 103, 'Pen Set', 1, 24.50),
  (5, 104, 'Monitor', 1, 210.00),
  (6, 105, 'Desk Chair', 1, 89.00),
  (7, 106, 'Mouse Pad', 2, 19.99);

-- Try me: SELECT c.name, COUNT(o.id) AS orders, SUM(o.total) AS spent FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id ORDER BY spent DESC;`,
  },
  {
    id: "students",
    name: "Students",
    description: "Students, courses & grades",
    sql: `CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  major TEXT
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  credits INTEGER
);

CREATE TABLE grades (
  student_id INTEGER REFERENCES students(id),
  course_id INTEGER REFERENCES courses(id),
  grade TEXT,
  PRIMARY KEY (student_id, course_id)
);

INSERT INTO students (id, name, major) VALUES
  (1, 'Aarav Patel', 'Computer Science'),
  (2, 'Sofia Rossi', 'Mathematics'),
  (3, 'Lucas Meyer', 'Physics'),
  (4, 'Amara Diallo', 'Computer Science'),
  (5, 'Ethan Kim', 'Mathematics');

INSERT INTO courses (id, title, credits) VALUES
  (1, 'Data Structures', 4),
  (2, 'Calculus II', 4),
  (3, 'Quantum Mechanics', 3),
  (4, 'Algorithms', 3),
  (5, 'Linear Algebra', 3);

INSERT INTO grades (student_id, course_id, grade) VALUES
  (1, 1, 'A'), (1, 4, 'A-'), (1, 5, 'B+'),
  (2, 2, 'A'), (2, 5, 'A'),
  (3, 3, 'B'), (3, 2, 'B+'),
  (4, 1, 'B+'), (4, 4, 'A'),
  (5, 2, 'A-'), (5, 5, 'A');

-- Try me: SELECT s.name, ROUND(AVG(CASE g.grade WHEN 'A' THEN 4 WHEN 'A-' THEN 3.7 WHEN 'B+' THEN 3.3 WHEN 'B' THEN 3.0 ELSE 2.7 END), 2) AS gpa FROM students s JOIN grades g ON g.student_id = s.id GROUP BY s.id ORDER BY gpa DESC;`,
  },
  {
    id: "customers",
    name: "Customers",
    description: "Customers & support tickets",
    sql: `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT,
  joined_date TEXT
);

CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  subject TEXT,
  status TEXT,
  opened_date TEXT
);

INSERT INTO customers (id, name, plan, joined_date) VALUES
  (1, 'Priya Sharma', 'Pro', '2024-01-15'),
  (2, 'James Wilson', 'Free', '2023-06-02'),
  (3, 'Fatima Noor', 'Business', '2025-03-10'),
  (4, 'Diego Fernandez', 'Pro', '2024-09-25'),
  (5, 'Chloe Martin', 'Free', '2025-11-01');

INSERT INTO tickets (id, customer_id, subject, status, opened_date) VALUES
  (1, 1, 'Cannot reset password', 'closed', '2026-05-02'),
  (2, 2, 'Billing question', 'open', '2026-06-18'),
  (3, 3, 'API rate limit exceeded', 'closed', '2026-04-30'),
  (4, 4, 'Feature request: dark mode', 'open', '2026-06-21'),
  (5, 1, 'Export not working', 'closed', '2026-05-14'),
  (6, 5, 'Where is my invoice?', 'open', '2026-06-28'),
  (7, 3, 'Team seats not syncing', 'closed', '2026-03-12');

-- Try me: SELECT c.plan, COUNT(t.id) AS tickets, SUM(CASE WHEN t.status = 'open' THEN 1 ELSE 0 END) AS open_tickets FROM customers c LEFT JOIN tickets t ON t.customer_id = c.id GROUP BY c.plan;`,
  },
];

/** Short, ready-to-run starter query shown on load. */
export const DEFAULT_SQL = `-- Welcome to the SQL Playground!
-- Pick a sample database above, then run queries like:

SELECT 'Hello, SQLite!' AS message;

-- Show all employees:
-- SELECT * FROM employees;

-- Join example:
-- SELECT e.name, d.name AS department
-- FROM employees e
-- JOIN departments d ON d.id = e.department_id;`;
