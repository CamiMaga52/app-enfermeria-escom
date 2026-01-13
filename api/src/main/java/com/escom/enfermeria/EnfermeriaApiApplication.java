package com.escom.enfermeria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class EnfermeriaApiApplication {
    
    private final JdbcTemplate jdbcTemplate;
    
    public EnfermeriaApiApplication(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public static void main(String[] args) {
        SpringApplication.run(EnfermeriaApiApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("=".repeat(60));
        System.out.println("🚀 SISTEMA DE INVENTARIO - ENFERMERÍA ESCOM");
        System.out.println("🚀 API Spring Boot iniciada correctamente");
        System.out.println("=".repeat(60));
        
        // Probar conexión a base de datos
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                System.out.println("✅ Base de datos PostgreSQL CONECTADA");
            } else {
                System.out.println("⚠️  Base de datos: Estado desconocido");
            }
        } catch (Exception e) {
            System.err.println("❌ Error conectando a la base de datos: " + e.getMessage());
            System.err.println("💡 Verifica que:");
            System.err.println("   1. PostgreSQL esté corriendo en Docker");
            System.err.println("   2. Las credenciales en application.yml sean correctas");
            System.err.println("   3. La base de datos 'inventario_db' exista");
        }
        
        System.out.println("\n📡 Endpoints disponibles:");
        System.out.println("   • GET  http://localhost:8080/api/auth/test");
        System.out.println("   • POST http://localhost:8080/api/auth/login");
        System.out.println("\n⚡ Esperando peticiones...");
        System.out.println("=".repeat(60));
    }
}