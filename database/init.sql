-- Create database
DROP DATABASE IF EXISTS finance_dashboard_db;
CREATE DATABASE finance_dashboard_db;

-- Connect to the database
\c finance_dashboard_db;

-- Create tbl_users table
CREATE TABLE tbl_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('viewer', 'analyst', 'admin')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tbl_financial_records table
CREATE TABLE tbl_financial_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES tbl_users(id) ON DELETE CASCADE,
    creator_id INTEGER,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON tbl_users(email);
CREATE INDEX idx_users_role ON tbl_users(role);
CREATE INDEX idx_records_user_id ON tbl_financial_records(user_id);
CREATE INDEX idx_records_type ON tbl_financial_records(type);
CREATE INDEX idx_records_category ON tbl_financial_records(category);
CREATE INDEX idx_records_date ON tbl_financial_records(date);
CREATE INDEX idx_records_is_deleted ON tbl_financial_records(is_deleted);


-- Insert default admin user (password: admin123)
INSERT INTO tbl_users (name, email, password, role, status) 
VALUES ('Admin User', 'admin@example.com', '$2a$10$XQnR5YZZKzJ5qCKCvZHxXeYgF8LZPzVbx4pYqK9R0XJxKzJ5qCKCv', 'admin', 'active');

-- Insert sample users
INSERT INTO tbl_users (name, email, password, role, status) 
VALUES 
    ('John Viewer', 'viewer@example.com', '$2a$10$XQnR5YZZKzJ5qCKCvZHxXeYgF8LZPzVbx4pYqK9R0XJxKzJ5qCKCv', 'viewer', 'active'),
    ('Jane Analyst', 'analyst@example.com', '$2a$10$XQnR5YZZKzJ5qCKCvZHxXeYgF8LZPzVbx4pYqK9R0XJxKzJ5qCKCv', 'analyst', 'active');

-- Insert sample financial records
INSERT INTO tbl_financial_records (user_id, amount, type, category, date, description) 
VALUES 
    (1, 5000.00, 'income', 'Salary', '2024-01-15', 'Monthly salary'),
    (1, 150.00, 'expense', 'Groceries', '2024-01-16', 'Weekly groceries'),
    (1, 75.00, 'expense', 'Transportation', '2024-01-17', 'Gas and toll'),
    (1, 2000.00, 'income', 'Freelance', '2024-01-20', 'Web development project'),
    (1, 500.00, 'expense', 'Rent', '2024-01-25', 'Monthly rent payment');

COMMIT;