-- ============================================
-- DATOS INICIALES DE PRUEBA
-- ============================================

-- Insertar roles
INSERT INTO rol (rol_nombre, rol_descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('ENFERMERO', 'Personal de enfermería'),
('AUXILIAR', 'Auxiliar de enfermería')
ON CONFLICT (rol_nombre) DO NOTHING;

-- Insertar administrador (password: admin123)
INSERT INTO administrador (admin_nombre, admin_ape_pat, admin_correo, admin_pass) VALUES
('Juan', 'Pérez', 'admin@escom.ipn.mx', '$2b$10$TuHashGeneradoParaAdmin123')
ON CONFLICT (admin_correo) DO NOTHING;

-- Insertar usuarios (password: usuario123)
INSERT INTO usuario (usuario_nombre, usuario_ape_pat, usuario_correo, usuario_pass, rol_id) VALUES
('María', 'García', 'maria.garcia@escom.ipn.mx', '$2b$10$TuHashGeneradoParaUsuario123', 
 (SELECT rol_id FROM rol WHERE rol_nombre = 'ENFERMERO')),
('Carlos', 'López', 'carlos.lopez@escom.ipn.mx', '$2b$10$TuHashGeneradoParaUsuario123', 
 (SELECT rol_id FROM rol WHERE rol_nombre = 'AUXILIAR'))
ON CONFLICT (usuario_correo) DO NOTHING;

-- Insertar categorías
INSERT INTO categoria (categoria_nom, categoria_desc) VALUES
('ANALGÉSICOS', 'Medicamentos para el dolor'),
('ANTIBIÓTICOS', 'Medicamentos antibacterianos'),
('MATERIAL CURAción', 'Material para curaciones'),
('EQUIPO PROTECCIÓN', 'Equipo de protección personal')
ON CONFLICT (categoria_nom) DO NOTHING;

-- Insertar pacientes
INSERT INTO paciente (paciente_nombre, paciente_escuela, paciente_edad) VALUES
('Ana Martínez', 'ESCOM IPN', 20),
('Luis Rodríguez', 'ESCOM IPN', 22),
('Sofía Hernández', 'ESCOM IPN', 21),
('Pedro Sánchez', 'ESCOM IPN', 23)
ON CONFLICT DO NOTHING;

-- Insertar medicamentos
INSERT INTO medicamento (medicamento_nom, medicamento_desc, medicamento_fec_comp, medicamento_fec_cad, 
                         medicamento_stock, medicamento_stock_min, categoria_id) VALUES
('Paracetamol 500mg', 'Analgésico y antipirético', '2024-01-15', '2025-01-15', 100, 20, 
 (SELECT categoria_id FROM categoria WHERE categoria_nom = 'ANALGÉSICOS')),
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', '2024-02-01', '2025-02-01', 50, 10,
 (SELECT categoria_id FROM categoria WHERE categoria_nom = 'ANTIBIÓTICOS')),
('Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', '2024-01-20', '2025-07-20', 75, 15,
 (SELECT categoria_id FROM categoria WHERE categoria_nom = 'ANALGÉSICOS'))
ON CONFLICT DO NOTHING;

-- Insertar materiales
INSERT INTO material (material_nom, material_desc, material_fec_comp, material_stock, material_stock_min, categoria_id) VALUES
('Guantes de látex', 'Guantes desechables talla M', '2024-03-01', 500, 100,
 (SELECT categoria_id FROM categoria WHERE categoria_nom = 'EQUIPO PROTECCIÓN')),
('Jeringa 3ml', 'Jeringa desechable estéril', '2024-03-10', 300, 50,
 (SELECT categoria_id FROM categoria WHERE categoria_nom = 'MATERIAL CURAción')),
('Gasas estériles', 'Paquete de gasas 10x10cm', '2024-02-15', 200, 30,
 (SELECT categoria_id FROM categoria WHERE categoria_nom = 'MATERIAL CURAción'))
ON CONFLICT DO NOTHING;