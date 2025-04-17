-- Script de inicialización de la base de datos Wel_SaaS

CREATE TYPE format_type AS ENUM ('fijo', 'variable');
CREATE TYPE role_type AS ENUM ('compra', 'encargado', 'operario', 'admin');
CREATE TYPE reception_status AS ENUM ('descargando', 'finalizado', 'en camino');

DROP DATABASE IF EXISTS wel_local;
CREATE DATABASE wel_local;
\c wel_local;

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
    description TEXT NOT NULL,
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
    deleted_at TIMESTAMP
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


    -- Insertar categorías de UOM
INSERT INTO uom_categories (name, description) VALUES
('Peso', 'Unidades de medida de peso'),
('Volumen', 'Unidades de medida de volumen'),
('Longitud', 'Unidades de medida de longitud');

-- Insertar unidades de medida
INSERT INTO uom_master (code, name, category_id) VALUES
('KG', 'Kilogramo', 1),
('LT', 'Litro', 2),
('MT', 'Metro', 3);

-- Insertar almacenes
INSERT INTO warehouses (warehouse_name, warehouse_number, description) VALUES
('Almacén Principal', 1, 'Almacén central de productos'),
('Almacén Secundario', 2, 'Almacén de respaldo'),
('Almacén Temporal', 3, 'Almacén para productos en tránsito');

-- Insertar proveedores
INSERT INTO suppliers (supplier_name, contact_name, contact_email, contact_phone, description) VALUES
('Proveedor 1', 'Contacto 1', 'contacto1@proveedor.com', '123-456-7890', 'Proveedor de productos A y C'), -- Proveedor de productos A y C
('Proveedor 2', 'Contacto 2', 'contacto2@proveedor.com', '987-654-3210', 'Proveedor del producto B'); -- Proveedor del producto B

-- Insertar productos
INSERT INTO products (code, product_name, uom_id, format, supplier_id, weight, description) VALUES
('PROD001', 'Producto A', 1, 'fijo', 1, 10.5, 'Descripción producto A'), -- Producto A del Proveedor 1
('PROD002', 'Producto B', 2, 'variable', 2, 5.2, 'Descripción producto B'), -- Producto B del Proveedor 2
('PROD003', 'Producto C', 1, 'fijo', 1, 15.7, 'Descripción producto C'); -- Producto C del Proveedor 1

-- Insertar usuarios
INSERT INTO users (first_name, last_name, email, employee_number, role, password) VALUES
('Juan', 'Pérez', 'juan@ejemplo.com', 'EMP001', 'admin', 'hashed_password_1'), -- Contraseña hasheada
('María', 'García', 'maria@ejemplo.com', 'EMP002', 'operario', 'hashed_password_2'), -- Contraseña hasheada
('Carlos', 'López', 'carlos@ejemplo.com', 'EMP003', 'encargado', 'hashed_password_3'); -- Contraseña hasheada
-- NOTA: En un entorno de producción, las contraseñas deben ser hasheadas con un algoritmo seguro como bcrypt.

-- Insertar recepciones
INSERT INTO receptions (vehicle, items, purchase_order, status, notes, created_by) VALUES
('Camión 001', 10, 'PO001', 'finalizado', 'Entrega completa', 1),
('Camión 002', 5, 'PO002', 'en camino', 'En ruta', 2),
('Camión 003', 8, 'PO003', 'descargando', 'Descarga en proceso', 3);

-- Insertar etiquetas
INSERT INTO labels (barcode, product_id, warehouse_id, quantity, weight, created_by) VALUES
('BAR001', 1, 1, 100, 1000.5, 1), -- Etiqueta para el Producto A en el Almacén Principal
('BAR002', 2, 2, 50, 260.0, 2), -- Etiqueta para el Producto B en el Almacén Secundario
('BAR003', 3, 3, 75, 1177.5, 3); -- Etiqueta para el Producto C en el Almacén Temporal

-- Insertar contadores de códigos de barras
INSERT INTO barcode_counters (barcode_base, counter) VALUES
('BASE001', 1), -- Contador para códigos de barras BASE001
('BASE002', 1), -- Contador para códigos de barras BASE002
('BASE003', 1); -- Contador para códigos de barras BASE003
