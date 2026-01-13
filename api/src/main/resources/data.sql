-- ============================================
-- DATOS DE PRUEBA PARA SISTEMA DE INVENTARIO
-- Solo se ejecuta si spring.jpa.hibernate.ddl-auto=create
-- ============================================

-- Insertar roles si no existen
INSERT INTO rol (rol_nombre, rol_descripcion) 
SELECT 'ADMINISTRADOR', 'Administrador del sistema'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_nombre = 'ADMINISTRADOR');

INSERT INTO rol (rol_nombre, rol_descripcion) 
SELECT 'ENFERMERO', 'Personal de enfermería'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_nombre = 'ENFERMERO');

INSERT INTO rol (rol_nombre, rol_descripcion) 
SELECT 'MEDICO', 'Médico responsable'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_nombre = 'MEDICO');

INSERT INTO rol (rol_nombre, rol_descripcion) 
SELECT 'AUXILIAR', 'Auxiliar de enfermería'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_nombre = 'AUXILIAR');

-- Insertar usuario administrador de prueba
INSERT INTO usuario (
    usuario_nombre, 
    usuario_ape_pat, 
    usuario_ape_mat, 
    usuario_correo, 
    usuario_pass, 
    usuario_activo, 
    rol_id
) 
SELECT 
    'Administrador', 
    'Sistema', 
    'ESCOM', 
    'admin@escom.com', 
    'admin123', 
    true, 
    (SELECT rol_id FROM rol WHERE rol_nombre = 'ADMINISTRADOR')
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario_correo = 'admin@escom.com');

-- Insertar usuario enfermero de prueba
INSERT INTO usuario (
    usuario_nombre, 
    usuario_ape_pat, 
    usuario_ape_mat, 
    usuario_correo, 
    usuario_pass, 
    usuario_activo, 
    rol_id
) 
SELECT 
    'Juan', 
    'Pérez', 
    'García', 
    'juan@escom.com', 
    'password123', 
    true, 
    (SELECT rol_id FROM rol WHERE rol_nombre = 'ENFERMERO')
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario_correo = 'juan@escom.com');

-- Insertar usuario médico de prueba
INSERT INTO usuario (
    usuario_nombre, 
    usuario_ape_pat, 
    usuario_ape_mat, 
    usuario_correo, 
    usuario_pass, 
    usuario_activo, 
    rol_id
) 
SELECT 
    'Dra. María', 
    'López', 
    'Sánchez', 
    'maria@escom.com', 
    'medico123', 
    true, 
    (SELECT rol_id FROM rol WHERE rol_nombre = 'MEDICO')
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario_correo = 'maria@escom.com');