package com.escom.enfermeria.dao;

import com.escom.enfermeria.models.Paciente;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class PacienteDAO {
    
    private final JdbcTemplate jdbcTemplate;
    
    public PacienteDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // RowMapper para Paciente
    private final RowMapper<Paciente> pacienteRowMapper = new RowMapper<Paciente>() {
        @Override
        public Paciente mapRow(ResultSet rs, int rowNum) throws SQLException {
            Paciente paciente = new Paciente();
            
            paciente.setPacienteId(rs.getInt("paciente_id"));
            paciente.setPacienteNombre(rs.getString("paciente_nombre"));
            paciente.setPacienteEscuela(rs.getString("paciente_escuela"));
            paciente.setPacienteEdad(rs.getInt("paciente_edad"));
            paciente.setPacienteTelefono(rs.getString("paciente_telefono"));
            paciente.setPacienteEmail(rs.getString("paciente_email"));
            
            if (rs.getTimestamp("created_at") != null) {
                paciente.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            }
            
            return paciente;
        }
    };
    
    // CREATE: Insertar nuevo paciente
    public Paciente create(Paciente paciente) {
        String sql = """
            INSERT INTO paciente (
                paciente_nombre, paciente_escuela, paciente_edad,
                paciente_telefono, paciente_email
            ) VALUES (?, ?, ?, ?, ?)
            RETURNING *
            """;
        
        return jdbcTemplate.queryForObject(sql, pacienteRowMapper,
            paciente.getPacienteNombre(),
            paciente.getPacienteEscuela(),
            paciente.getPacienteEdad(),
            paciente.getPacienteTelefono(),
            paciente.getPacienteEmail()
        );
    }
    
    // READ: Obtener todos los pacientes
    public List<Paciente> findAll() {
        String sql = """
            SELECT * FROM paciente 
            ORDER BY paciente_id DESC
            """;
        return jdbcTemplate.query(sql, pacienteRowMapper);
    }
    
    // READ: Obtener paciente por ID
    public Paciente findById(Integer id) {
        try {
            String sql = "SELECT * FROM paciente WHERE paciente_id = ?";
            return jdbcTemplate.queryForObject(sql, pacienteRowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }
    
    // READ: Buscar pacientes por término
    public List<Paciente> findByTermino(String termino) {
        String sql = """
            SELECT * FROM paciente 
            WHERE LOWER(paciente_nombre) LIKE LOWER(?) 
               OR LOWER(paciente_escuela) LIKE LOWER(?)
               OR LOWER(paciente_email) LIKE LOWER(?)
               OR paciente_telefono LIKE ?
            ORDER BY paciente_nombre
            """;
        String likeTermino = "%" + termino + "%";
        return jdbcTemplate.query(sql, pacienteRowMapper, likeTermino, likeTermino, likeTermino, likeTermino);
    }
    
    // READ: Buscar pacientes por escuela
    public List<Paciente> findByEscuela(String escuela) {
        String sql = """
            SELECT * FROM paciente 
            WHERE LOWER(paciente_escuela) LIKE LOWER(?)
            ORDER BY paciente_nombre
            """;
        return jdbcTemplate.query(sql, pacienteRowMapper, "%" + escuela + "%");
    }
    
    // UPDATE: Actualizar paciente
    public Paciente update(Paciente paciente) {
        String sql = """
            UPDATE paciente SET
                paciente_nombre = ?,
                paciente_escuela = ?,
                paciente_edad = ?,
                paciente_telefono = ?,
                paciente_email = ?
            WHERE paciente_id = ?
            RETURNING *
            """;
        
        return jdbcTemplate.queryForObject(sql, pacienteRowMapper,
            paciente.getPacienteNombre(),
            paciente.getPacienteEscuela(),
            paciente.getPacienteEdad(),
            paciente.getPacienteTelefono(),
            paciente.getPacienteEmail(),
            paciente.getPacienteId()
        );
    }
    
    // DELETE: Eliminar paciente
    public boolean delete(Integer id) {
        String sql = "DELETE FROM paciente WHERE paciente_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }
    
    // Contar total de pacientes
    public Integer count() {
        String sql = "SELECT COUNT(*) FROM paciente";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
    
    // Obtener promedio de edad
    public Double promedioEdad() {
        try {
            String sql = "SELECT AVG(paciente_edad) FROM paciente";
            return jdbcTemplate.queryForObject(sql, Double.class);
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    // Obtener escuelas únicas
    public List<String> findEscuelasUnicas() {
        String sql = "SELECT DISTINCT paciente_escuela FROM paciente ORDER BY paciente_escuela";
        return jdbcTemplate.queryForList(sql, String.class);
    }
    
    // Obtener distribución por edad
    public Integer countByEdadRange(Integer min, Integer max) {
        try {
            String sql = "SELECT COUNT(*) FROM paciente WHERE paciente_edad BETWEEN ? AND ?";
            return jdbcTemplate.queryForObject(sql, Integer.class, min, max);
        } catch (Exception e) {
            return 0;
        }
    }

    public JdbcTemplate getJdbcTemplate() {
    return this.jdbcTemplate;
}
}
