package com.escom.enfermeria.dao;

import com.escom.enfermeria.models.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UsuarioDAO {
    
    private final JdbcTemplate jdbcTemplate;
    
    public UsuarioDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // RowMapper CORREGIDO según tu estructura REAL
    private final RowMapper<Usuario> usuarioRowMapper = new RowMapper<Usuario>() {
        @Override
        public Usuario mapRow(ResultSet rs, int rowNum) throws SQLException {
            Usuario usuario = new Usuario();
            
            // Mapeo EXACTO según tu estructura de BD
            usuario.setUsuarioId(rs.getInt("usuario_id"));
            usuario.setUsuarioNombre(rs.getString("usuario_nombre"));
            usuario.setUsuarioApePat(rs.getString("usuario_ape_pat"));
            usuario.setUsuarioApeMat(rs.getString("usuario_ape_mat"));
            usuario.setUsuarioCorreo(rs.getString("usuario_correo"));
            usuario.setUsuarioPass(rs.getString("usuario_pass")); // Esto está HASHED
            
            // Campos que pueden ser nulos
            if (rs.getTimestamp("usuario_ult_acc") != null) {
                usuario.setUsuarioUltAcc(rs.getTimestamp("usuario_ult_acc").toLocalDateTime());
            }
            if (rs.getTimestamp("usuario_fec_reg") != null) {
                usuario.setUsuarioFecReg(rs.getTimestamp("usuario_fec_reg").toLocalDateTime());
            }
            
            usuario.setUsuarioActivo(rs.getBoolean("usuario_activo"));
            usuario.setRolId(rs.getInt("rol_id"));
            usuario.setRolNombre(rs.getString("rol_nombre")); // De la tabla rol
            
            return usuario;
        }
    };
    
    // Método: Login SIN verificación de password (solo para pruebas)
    public Usuario loginSinPassword(String correo) {
        try {
            System.out.println("🔍 DAO: Buscando usuario por correo: " + correo);
            
            String sql = """
                SELECT 
                    u.usuario_id,
                    u.usuario_nombre,
                    u.usuario_ape_pat,
                    u.usuario_ape_mat,
                    u.usuario_correo,
                    u.usuario_pass,
                    u.usuario_ult_acc,
                    u.usuario_fec_reg,
                    u.usuario_activo,
                    u.rol_id,
                    r.rol_nombre
                FROM usuario u 
                LEFT JOIN rol r ON u.rol_id = r.rol_id 
                WHERE LOWER(u.usuario_correo) = LOWER(?)
                AND u.usuario_activo = true
                """;
            
            List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper, correo);
            
            if (!usuarios.isEmpty()) {
                Usuario usuario = usuarios.get(0);
                System.out.println("✅ DAO: Usuario encontrado: " + usuario.getUsuarioCorreo());
                System.out.println("📝 DAO: Rol del usuario: " + usuario.getRolNombre());
                
                // Actualizar último acceso
                actualizarUltimoAcceso(usuario.getUsuarioId());
                return usuario;
            }
            
            System.out.println("❌ DAO: No se encontró usuario: " + correo);
            return null;
            
        } catch (Exception e) {
            System.err.println("❌ DAO: Error en loginSinPassword: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    public boolean actualizarUltimoAcceso(int usuarioId) {
        try {
            String sql = "UPDATE usuario SET usuario_ult_acc = CURRENT_TIMESTAMP WHERE usuario_id = ?";
            int rowsAffected = jdbcTemplate.update(sql, usuarioId);
            boolean actualizado = rowsAffected > 0;
            
            if (actualizado) {
                System.out.println("✅ DAO: Último acceso actualizado para usuario ID: " + usuarioId);
            }
            
            return actualizado;
            
        } catch (Exception e) {
            System.err.println("❌ DAO: Error actualizando último acceso: " + e.getMessage());
            return false;
        }
    }
    
    // Métodos de utilidad
    public Integer testConnection() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            System.out.println("✅ DAO: Conexión a BD probada: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("❌ DAO: Error probando conexión: " + e.getMessage());
            return null;
        }
    }
    
    public Integer countUsuarios() {
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM usuario", Integer.class);
            System.out.println("📊 DAO: Total usuarios en BD: " + count);
            return count;
        } catch (Exception e) {
            System.err.println("❌ DAO: Error contando usuarios: " + e.getMessage());
            return 0;
        }
    }
    
    public List<Usuario> getAllUsuarios() {
        try {
            String sql = """
                SELECT u.*, r.rol_nombre 
                FROM usuario u 
                LEFT JOIN rol r ON u.rol_id = r.rol_id
                ORDER BY u.usuario_id
                LIMIT 20
                """;
            
            List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper);
            System.out.println("📋 DAO: Obtenidos " + usuarios.size() + " usuarios");
            return usuarios;
            
        } catch (Exception e) {
            System.err.println("❌ DAO: Error obteniendo usuarios: " + e.getMessage());
            return List.of(); // Lista vacía
        }
    }
    
    // Método adicional: Obtener información de la BD
    public Map<String, Object> getDatabaseInfo() {
        Map<String, Object> info = new HashMap<>();
        
        try {
            // Versión de PostgreSQL
            String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
            info.put("version", version);
            
            // Número de tablas
            Integer tableCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'", 
                Integer.class
            );
            info.put("tableCount", tableCount);
            
            // Lista de tablas
            List<String> tables = jdbcTemplate.queryForList(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
                String.class
            );
            info.put("tables", tables);
            
            System.out.println("✅ DAO: Información de BD obtenida");
            
        } catch (Exception e) {
            System.err.println("❌ DAO: Error obteniendo info de BD: " + e.getMessage());
            info.put("error", e.getMessage());
        }
        
        return info;
    }
}