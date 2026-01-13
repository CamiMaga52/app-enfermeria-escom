-- ============================================
-- SISTEMA DE INVENTARIO - ENFERMERÍA ESCOM
-- Base de datos PostgreSQL
-- ============================================

-- Tabla: rol (roles de usuario)
CREATE TABLE IF NOT EXISTS rol (
    rol_id SERIAL PRIMARY KEY,
    rol_nombre VARCHAR(45) NOT NULL UNIQUE,
    rol_descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: administrador
CREATE TABLE IF NOT EXISTS administrador (
    admin_id SERIAL PRIMARY KEY,
    admin_nombre VARCHAR(45) NOT NULL,
    admin_ape_pat VARCHAR(45) NOT NULL,
    admin_ape_mat VARCHAR(45),
    admin_fec_nac DATE,
    admin_correo VARCHAR(100) UNIQUE,
    admin_pass VARCHAR(255) NOT NULL,
    admin_ult_acc TIMESTAMP,
    admin_activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: usuario (usuarios del sistema)
CREATE TABLE IF NOT EXISTS usuario (
    usuario_id SERIAL PRIMARY KEY,
    usuario_nombre VARCHAR(45) NOT NULL,
    usuario_ape_pat VARCHAR(45) NOT NULL,
    usuario_ape_mat VARCHAR(45),
    usuario_correo VARCHAR(100) UNIQUE NOT NULL,
    usuario_pass VARCHAR(255) NOT NULL,
    usuario_ult_acc TIMESTAMP,
    usuario_fec_reg TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_activo BOOLEAN DEFAULT TRUE,
    rol_id INTEGER NOT NULL REFERENCES rol(rol_id)
);

-- Tabla: categoria (categorías para medicamentos/materiales)
CREATE TABLE IF NOT EXISTS categoria (
    categoria_id SERIAL PRIMARY KEY,
    categoria_nom VARCHAR(45) NOT NULL UNIQUE,
    categoria_desc TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: paciente
CREATE TABLE IF NOT EXISTS paciente (
    paciente_id SERIAL PRIMARY KEY,
    paciente_nombre VARCHAR(60) NOT NULL,
    paciente_escuela VARCHAR(80),
    paciente_edad INTEGER,
    paciente_telefono VARCHAR(15),
    paciente_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: medicamento
CREATE TABLE IF NOT EXISTS medicamento (
    medicamento_id SERIAL PRIMARY KEY,
    medicamento_nom VARCHAR(60) NOT NULL,
    medicamento_desc TEXT,
    medicamento_fec_comp DATE,
    medicamento_fec_cad DATE,
    medicamento_lote VARCHAR(50),
    medicamento_laboratorio VARCHAR(100),
    medicamento_estado VARCHAR(30) CHECK (medicamento_estado IN ('DISPONIBLE', 'AGOTADO', 'CADUCADO', 'RESERVADO')),
    medicamento_stock INTEGER NOT NULL DEFAULT 0,
    medicamento_stock_min INTEGER DEFAULT 10,
    medicamento_precio DECIMAL(10,2),
    categoria_id INTEGER REFERENCES categoria(categoria_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: material (material médico)
CREATE TABLE IF NOT EXISTS material (
    material_id SERIAL PRIMARY KEY,
    material_nom VARCHAR(60) NOT NULL,
    material_desc TEXT,
    material_fec_comp DATE,
    material_estado VARCHAR(30) CHECK (material_estado IN ('DISPONIBLE', 'AGOTADO', 'DESGASTADO', 'MANTENIMIENTO')),
    material_stock INTEGER NOT NULL DEFAULT 0,
    material_stock_min INTEGER DEFAULT 5,
    material_precio DECIMAL(10,2),
    categoria_id INTEGER REFERENCES categoria(categoria_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: receta
CREATE TABLE IF NOT EXISTS receta (
    receta_id SERIAL PRIMARY KEY,
    receta_folio VARCHAR(20) UNIQUE,
    receta_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    receta_diag VARCHAR(100),
    receta_obs TEXT,
    receta_estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (receta_estado IN ('ACTIVA', 'COMPLETADA', 'CANCELADA')),
    paciente_id INTEGER NOT NULL REFERENCES paciente(paciente_id),
    usuario_id INTEGER NOT NULL REFERENCES usuario(usuario_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: detalle_receta
CREATE TABLE IF NOT EXISTS detalle_receta (
    det_receta_id SERIAL PRIMARY KEY,
    det_receta_med VARCHAR(80) NOT NULL,
    det_receta_cant INTEGER NOT NULL CHECK (det_receta_cant > 0),
    det_receta_dosis VARCHAR(70),
    det_receta_dur VARCHAR(70),
    det_receta_indicaciones TEXT,
    receta_id INTEGER NOT NULL REFERENCES receta(receta_id) ON DELETE CASCADE,
    medicamento_id INTEGER REFERENCES medicamento(medicamento_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: movimiento (entradas y salidas de inventario)
CREATE TABLE IF NOT EXISTS movimiento (
    movimiento_id SERIAL PRIMARY KEY,
    movimiento_tipo VARCHAR(10) NOT NULL CHECK (movimiento_tipo IN ('ENTRADA', 'SALIDA')),
    movimiento_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    movimiento_cant INTEGER NOT NULL CHECK (movimiento_cant > 0),
    movimiento_motivo VARCHAR(100),
    movimiento_ref VARCHAR(50), -- Referencia (factura, orden, etc.)
    usuario_id INTEGER NOT NULL REFERENCES usuario(usuario_id),
    medicamento_id INTEGER REFERENCES medicamento(medicamento_id),
    material_id INTEGER REFERENCES material(material_id),
    receta_id INTEGER REFERENCES receta(receta_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Asegurar que solo un tipo de item esté vinculado
    CONSTRAINT chk_item_type CHECK (
        (medicamento_id IS NOT NULL AND material_id IS NULL) OR
        (medicamento_id IS NULL AND material_id IS NOT NULL)
    )
);

-- Tabla: reporte (reportes generados)
CREATE TABLE IF NOT EXISTS reporte (
    reporte_id SERIAL PRIMARY KEY,
    reporte_tipo VARCHAR(50) NOT NULL,
    reporte_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reporte_periodo VARCHAR(20), -- 'DIARIO', 'SEMANAL', 'MENSUAL'
    reporte_desc TEXT,
    reporte_url VARCHAR(255), -- URL del archivo generado
    usuario_id INTEGER REFERENCES usuario(usuario_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);