-- Create database
DROP DATABASE IF EXISTS finance_dashboard_db;
CREATE DATABASE finance_dashboard_db;

-- Connect to the database
\c finance_dashboard_db;

-- Create tbl_users table
CREATE TABLE IF NOT EXISTS public.tbl_users
(
    id integer NOT NULL DEFAULT nextval('tbl_users_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(50) COLLATE pg_catalog."default" NOT NULL,
    status character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tbl_users_pkey PRIMARY KEY (id),
    CONSTRAINT tbl_users_email_key UNIQUE (email),
    CONSTRAINT tbl_users_role_check CHECK (role::text = ANY (ARRAY['viewer'::character varying, 'analyst'::character varying, 'admin'::character varying]::text[])),
    CONSTRAINT tbl_users_status_check CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_users
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS idx_users_email
    ON public.tbl_users USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_users_role
    ON public.tbl_users USING btree
    (role COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Create tbl_financial_records table

CREATE TABLE IF NOT EXISTS public.tbl_financial_records
(
    id integer NOT NULL DEFAULT nextval('tbl_financial_records_id_seq1'::regclass),
    user_id integer,
    creator_id integer,
    amount numeric(15,2) NOT NULL,
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    description text COLLATE pg_catalog."default",
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_id integer,
    CONSTRAINT tbl_financial_records_pkey1 PRIMARY KEY (id),
    CONSTRAINT tbl_financial_records_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.tbl_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tbl_financial_records_user_id_fkey1 FOREIGN KEY (user_id)
        REFERENCES public.tbl_users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT tbl_financial_records_type_check1 CHECK (type::text = ANY (ARRAY['income'::character varying, 'expense'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_financial_records
    OWNER to postgres;


-- Create tbl_categories


CREATE TABLE IF NOT EXISTS public.tbl_categories
(
    id integer NOT NULL DEFAULT nextval('tbl_categories_id_seq'::regclass),
    category_type character varying(100) COLLATE pg_catalog."default" NOT NULL,
    status boolean DEFAULT true,
    created_at date DEFAULT CURRENT_TIMESTAMP,
    updated_at date DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tbl_categories_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_categories
    OWNER to postgres;

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