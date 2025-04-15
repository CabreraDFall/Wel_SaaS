DROP DATABASE IF EXISTS wel_local;

CREATE DATABASE wel_local;

\c wel_local;

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL, 
    udm VARCHAR(50) NOT NULL,
    format VARCHAR(10) NOT NULL CHECK (format IN ('fijo', 'variable')),
    supplier VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS receptions (
    id SERIAL PRIMARY KEY,
    reception_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vehicle VARCHAR(100) NOT NULL,
    items INTEGER NOT NULL CHECK (items >= 0),
    purchase_order VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('descargando', 'finalizado', 'en camino')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    employee_number VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('compra', 'encargado', 'operario', 'admin')),
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS labels (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(25) NOT NULL UNIQUE,
    product_code VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    udm VARCHAR(50) NOT NULL,
    format VARCHAR(10) NOT NULL CHECK (format IN ('fijo', 'variable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    warehouse_number INTEGER NOT NULL CHECK (warehouse_number >= 0 AND warehouse_number <= 9) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS barcode_counters (
    id SERIAL PRIMARY KEY,
    barcode_base VARCHAR(25) NOT NULL UNIQUE,
    counter INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 