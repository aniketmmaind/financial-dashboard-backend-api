--
-- PostgreSQL database dump
--

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg12+1)
-- Dumped by pg_dump version 16.13

-- Started on 2026-04-06 10:48:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: financial_db_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO financial_db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16404)
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: financial_db_user
--

CREATE TABLE public.tbl_categories (
    id integer NOT NULL,
    category_type character varying(100) NOT NULL,
    status boolean DEFAULT true,
    created_at date DEFAULT CURRENT_TIMESTAMP,
    updated_at date DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tbl_categories OWNER TO financial_db_user;

--
-- TOC entry 216 (class 1259 OID 16410)
-- Name: tbl_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: financial_db_user
--

CREATE SEQUENCE public.tbl_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_categories_id_seq OWNER TO financial_db_user;

--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 216
-- Name: tbl_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: financial_db_user
--

ALTER SEQUENCE public.tbl_categories_id_seq OWNED BY public.tbl_categories.id;


--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: tbl_financial_records; Type: TABLE; Schema: public; Owner: financial_db_user
--

CREATE TABLE public.tbl_financial_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    creator_id uuid,
    category_id integer,
    amount numeric(15,2) NOT NULL,
    type character varying(50) NOT NULL,
    date date NOT NULL,
    description text,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tbl_financial_records_type_check1 CHECK (((type)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.tbl_financial_records OWNER TO financial_db_user;

--
-- TOC entry 218 (class 1259 OID 16421)
-- Name: tbl_users; Type: TABLE; Schema: public; Owner: financial_db_user
--

CREATE TABLE public.tbl_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role text DEFAULT 'viewer'::text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tbl_users_role_check CHECK ((role = ANY (ARRAY['viewer'::text, 'analyst'::text, 'admin'::text]))),
    CONSTRAINT tbl_users_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'deleted'::text])))
);


ALTER TABLE public.tbl_users OWNER TO financial_db_user;

--
-- TOC entry 3215 (class 2604 OID 16433)
-- Name: tbl_categories id; Type: DEFAULT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_categories ALTER COLUMN id SET DEFAULT nextval('public.tbl_categories_id_seq'::regclass);


--
-- TOC entry 3232 (class 2606 OID 16435)
-- Name: tbl_categories tbl_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16462)
-- Name: tbl_categories tbl_categories_type_isunique; Type: CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categories_type_isunique UNIQUE (category_type);


--
-- TOC entry 3241 (class 2606 OID 16437)
-- Name: tbl_financial_records tbl_financial_records_pkey1; Type: CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_financial_records
    ADD CONSTRAINT tbl_financial_records_pkey1 PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 16439)
-- Name: tbl_users tbl_users_email_key; Type: CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT tbl_users_email_key UNIQUE (email);


--
-- TOC entry 3247 (class 2606 OID 16441)
-- Name: tbl_users tbl_users_pkey; Type: CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT tbl_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 1259 OID 16442)
-- Name: idx_records_category; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_records_category ON public.tbl_financial_records USING btree (category_id);


--
-- TOC entry 3236 (class 1259 OID 16443)
-- Name: idx_records_date; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_records_date ON public.tbl_financial_records USING btree (date);


--
-- TOC entry 3237 (class 1259 OID 16444)
-- Name: idx_records_is_deleted; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_records_is_deleted ON public.tbl_financial_records USING btree (is_deleted);


--
-- TOC entry 3238 (class 1259 OID 16445)
-- Name: idx_records_type; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_records_type ON public.tbl_financial_records USING btree (type);


--
-- TOC entry 3239 (class 1259 OID 16446)
-- Name: idx_records_user_id; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_records_user_id ON public.tbl_financial_records USING btree (user_id);


--
-- TOC entry 3242 (class 1259 OID 16447)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_users_email ON public.tbl_users USING btree (email);


--
-- TOC entry 3243 (class 1259 OID 16448)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: financial_db_user
--

CREATE INDEX idx_users_role ON public.tbl_users USING btree (role);


--
-- TOC entry 3248 (class 2606 OID 16449)
-- Name: tbl_financial_records tbl_financial_records_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_financial_records
    ADD CONSTRAINT tbl_financial_records_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.tbl_categories(id);


--
-- TOC entry 3249 (class 2606 OID 16454)
-- Name: tbl_financial_records tbl_financial_records_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: financial_db_user
--

ALTER TABLE ONLY public.tbl_financial_records
    ADD CONSTRAINT tbl_financial_records_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.tbl_users(id) ON DELETE CASCADE;


--
-- TOC entry 2047 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO financial_db_user;


--
-- TOC entry 2049 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO financial_db_user;


--
-- TOC entry 2048 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO financial_db_user;


--
-- TOC entry 2046 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO financial_db_user;


-- Insert default admin user (password: admin123)
INSERT INTO tbl_users (name, email, password, role, status) 
VALUES ('Admin User', '$2a$10$Xh0bKjDkljMCeiysaIIwh.jTrNEq6xPTu7V0aRsoWz6k75IMwqBfO', 'admin', 'active');

-- Insert sample users
INSERT INTO tbl_users (name, email, password, role, status) 
VALUES 
    ('Test Viewer', 'viewer@test.com', '$2a$10$tOh32GPAD7Nm1RqkM.ZxpOMesBQThJ12E1pEQrF/u7KIUYDDSpL2q', 'viewer', 'active'),
    ('Test Analyst', 'analyst@test.com', '$2a$10$2kG2aN5m7IfOg0llkuC3L.NdGdFshZKvj2hLCPEUv0E2snYp82ncK', 'analyst', 'active');

-- Insert sample categories

INSERT INTO tbl_categories (category_type)
VALUES 
    ("Food & Dining"),
    ("Groceries"),
    ("Transportation"),
    ("Rent"),
    ("Utilities"),
    ("Entertainment"),
    ("Healthcare"),
    ("Salary"),
    ("Freelance"),
    ("Investments"),
    ("Accessories");

-- Completed on 2026-04-06 10:49:16

--
-- PostgreSQL database dump complete
--