-- Script de inicialización que Docker ejecutará automáticamente
CREATE DATABASE enfermeria_escom;

\c enfermeria_escom;

-- Mensaje de inicio
DO $$
BEGIN
    RAISE NOTICE '=======================================';
    RAISE NOTICE 'INICIALIZANDO BD ENFERMERÍA ESCOM';
    RAISE NOTICE '=======================================';
END $$;