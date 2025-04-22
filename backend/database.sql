-- Script de inicialización de la base de datos Wel_SaaS

DROP DATABASE IF EXISTS wel_local;
CREATE DATABASE wel_local;
\c wel_local;

CREATE TYPE format_type AS ENUM ('fijo', 'variable');
CREATE TYPE role_type AS ENUM ('compra', 'encargado', 'operario', 'admin');
CREATE TYPE reception_status AS ENUM ('descargando', 'finalizado', 'en camino');


-- Tabla de categorías de unidades de medida
CREATE TABLE IF NOT EXISTS uom_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla maestra de unidades de medida
CREATE TABLE IF NOT EXISTS uom_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    category_id UUID NOT NULL REFERENCES uom_categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de almacenes
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_name VARCHAR(100) NOT NULL,
    warehouse_number INTEGER NOT NULL CHECK (warehouse_number >= 0 AND warehouse_number <= 9) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_name VARCHAR(100) NOT NULL UNIQUE,
    contact_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    uom_id UUID REFERENCES uom_master(id) ON DELETE RESTRICT,
    format format_type NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
    weight DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    employee_number VARCHAR(50) NOT NULL UNIQUE,
    role role_type NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
); 

-- Tabla de recepciones
CREATE TABLE IF NOT EXISTS receptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reception_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vehicle VARCHAR(100) NOT NULL,
    items INTEGER NOT NULL CHECK (items >= 0),
    purchase_order VARCHAR(100) NOT NULL,
    status reception_status NOT NULL,
    notes TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted_at TIMESTAMP
); 

-- Tabla de etiquetas
CREATE TABLE IF NOT EXISTS labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode VARCHAR(25) NOT NULL UNIQUE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    weight DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    purchase_order VARCHAR(255) NULL
); 

-- Tabla de contadores de códigos de barras
CREATE TABLE IF NOT EXISTS barcode_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode_base VARCHAR(25) NOT NULL UNIQUE,
    counter INTEGER NOT NULL DEFAULT 1,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- Índices para optimizar el rendimiento
CREATE INDEX idx_labels_barcode ON labels(barcode);
CREATE INDEX idx_labels_product_id ON labels(product_id);
CREATE INDEX idx_labels_warehouse_id ON labels(warehouse_id);
CREATE INDEX idx_labels_created_by ON labels(created_by);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_uom_id ON products(uom_id);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_number ON users(employee_number);
CREATE INDEX idx_receptions_status ON receptions(status);
CREATE INDEX idx_receptions_date ON receptions(reception_date);
CREATE INDEX idx_uom_master_code ON uom_master(code);

-- Triggers para actualización automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas que tienen updated_at
CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labels_modtime
    BEFORE UPDATE ON labels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_modtime
    BEFORE UPDATE ON warehouses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uom_master_modtime
    BEFORE UPDATE ON uom_master
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uom_categories_modtime
    BEFORE UPDATE ON uom_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receptions_modtime
    BEFORE UPDATE ON receptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
