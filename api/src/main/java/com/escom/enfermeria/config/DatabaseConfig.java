package com.escom.enfermeria.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {
    
    // Spring Boot auto-configura el DataSource basado en application.yml
    // Podemos inyectarlo donde lo necesitemos
    
    public static boolean testConnection(DataSource dataSource) {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception e) {
            System.err.println("❌ Error probando conexión a BD: " + e.getMessage());
            return false;
        }
    }
}