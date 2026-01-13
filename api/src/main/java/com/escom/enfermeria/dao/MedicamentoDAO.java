package com.escom.enfermeria.dao;

import com.escom.enfermeria.models.Medicamento;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MedicamentoDAO {
    
    private final JdbcTemplate jdbcTemplate;
    
    public MedicamentoDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // RowMapper para Medicamento
    private final RowMapper<Medicamento> medicamentoRowMapper = new RowMapper<Medicamento>() {
        @Override
        public Medicamento mapRow(ResultSet rs, int rowNum) throws SQLException {
            Medicamento medicamento = new Medicamento();
            
            medicamento.setMedicamentoId(rs.getInt("medicamento_id"));
            medicamento.setMedicamentoNom(rs.getString("medicamento_nom"));
            medicamento.setMedicamentoDesc(rs.getString("medicamento_desc"));
            
            // Manejar fechas que pueden ser null
            if (rs.getDate("medicamento_fec_comp") != null) {
                medicamento.setMedicamentoFecComp(rs.getDate("medicamento_fec_comp").toLocalDate());
            }
            if (rs.getDate("medicamento_fec_cad") != null) {
                medicamento.setMedicamentoFecCad(rs.getDate("medicamento_fec_cad").toLocalDate());
            }
            
            medicamento.setMedicamentoLote(rs.getString("medicamento_lote"));
            medicamento.setMedicamentoLaboratorio(rs.getString("medicamento_laboratorio"));
            medicamento.setMedicamentoEstado(rs.getString("medicamento_estado"));
            medicamento.setMedicamentoStock(rs.getInt("medicamento_stock"));
            medicamento.setMedicamentoStockMin(rs.getInt("medicamento_stock_min"));
            medicamento.setMedicamentoPrecio(rs.getBigDecimal("medicamento_precio"));
            medicamento.setCategoriaId(rs.getInt("categoria_id"));
            
            // Obtener nombre de categoría si está en el resultado
            try {
                medicamento.setCategoriaNombre(rs.getString("categoria_nom"));
            } catch (SQLException e) {
                // Columna no presente, ignorar
            }
            
            if (rs.getTimestamp("created_at") != null) {
                medicamento.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            }
            if (rs.getTimestamp("updated_at") != null) {
                medicamento.setUpdated_at(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            
            return medicamento;
        }
    };
    
    // CREATE: Insertar nuevo medicamento
    public Medicamento create(Medicamento medicamento) {
        String sql = """
            INSERT INTO medicamento (
                medicamento_nom, medicamento_desc, medicamento_fec_comp,
                medicamento_fec_cad, medicamento_lote, medicamento_laboratorio,
                medicamento_estado, medicamento_stock, medicamento_stock_min,
                medicamento_precio, categoria_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            """;
        
        return jdbcTemplate.queryForObject(sql, medicamentoRowMapper,
            medicamento.getMedicamentoNom(),
            medicamento.getMedicamentoDesc(),
            medicamento.getMedicamentoFecComp(),
            medicamento.getMedicamentoFecCad(),
            medicamento.getMedicamentoLote(),
            medicamento.getMedicamentoLaboratorio(),
            medicamento.getMedicamentoEstado(),
            medicamento.getMedicamentoStock(),
            medicamento.getMedicamentoStockMin(),
            medicamento.getMedicamentoPrecio(),
            medicamento.getCategoriaId()
        );
    }
    
    // READ: Obtener todos los medicamentos
    public List<Medicamento> findAll() {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM medicamento m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            ORDER BY m.medicamento_id DESC
            """;
        return jdbcTemplate.query(sql, medicamentoRowMapper);
    }
    
    // READ: Obtener medicamento por ID
    public Medicamento findById(Integer id) {
        try {
            String sql = """
                SELECT m.*, c.categoria_nom 
                FROM medicamento m 
                LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
                WHERE m.medicamento_id = ?
                """;
            return jdbcTemplate.queryForObject(sql, medicamentoRowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }
    
    // READ: Buscar medicamentos por nombre
    public List<Medicamento> findByNombre(String nombre) {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM medicamento m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE LOWER(m.medicamento_nom) LIKE LOWER(?)
            ORDER BY m.medicamento_nom
            """;
        return jdbcTemplate.query(sql, medicamentoRowMapper, "%" + nombre + "%");
    }
    
    // UPDATE: Actualizar medicamento
    public Medicamento update(Medicamento medicamento) {
        String sql = """
            UPDATE medicamento SET
                medicamento_nom = ?,
                medicamento_desc = ?,
                medicamento_fec_comp = ?,
                medicamento_fec_cad = ?,
                medicamento_lote = ?,
                medicamento_laboratorio = ?,
                medicamento_estado = ?,
                medicamento_stock = ?,
                medicamento_stock_min = ?,
                medicamento_precio = ?,
                categoria_id = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE medicamento_id = ?
            RETURNING *
            """;
        
        return jdbcTemplate.queryForObject(sql, medicamentoRowMapper,
            medicamento.getMedicamentoNom(),
            medicamento.getMedicamentoDesc(),
            medicamento.getMedicamentoFecComp(),
            medicamento.getMedicamentoFecCad(),
            medicamento.getMedicamentoLote(),
            medicamento.getMedicamentoLaboratorio(),
            medicamento.getMedicamentoEstado(),
            medicamento.getMedicamentoStock(),
            medicamento.getMedicamentoStockMin(),
            medicamento.getMedicamentoPrecio(),
            medicamento.getCategoriaId(),
            medicamento.getMedicamentoId()
        );
    }
    
    // UPDATE: Actualizar solo el stock
    public int updateStock(Integer id, Integer nuevoStock) {
        String sql = """
            UPDATE medicamento SET
                medicamento_stock = ?,
                medicamento_estado = CASE 
                    WHEN ? <= 0 THEN 'AGOTADO'
                    WHEN ? < medicamento_stock_min THEN 'RESERVADO'
                    ELSE 'DISPONIBLE'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE medicamento_id = ?
            """;
        return jdbcTemplate.update(sql, nuevoStock, nuevoStock, nuevoStock, id);
    }
    
    // DELETE: Eliminar medicamento
    public boolean delete(Integer id) {
        String sql = "DELETE FROM medicamento WHERE medicamento_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }
    
    // Contar total de medicamentos
    public Integer count() {
        String sql = "SELECT COUNT(*) FROM medicamento";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
    
    // Obtener medicamentos por estado
    public List<Medicamento> findByEstado(String estado) {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM medicamento m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE m.medicamento_estado = ?
            ORDER BY m.medicamento_fec_cad
            """;
        return jdbcTemplate.query(sql, medicamentoRowMapper, estado);
    }
    
    // Obtener medicamentos próximos a caducar (30 días)
    public List<Medicamento> findProximosCaducar() {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM medicamento m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE m.medicamento_fec_cad BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
            ORDER BY m.medicamento_fec_cad
            """;
        return jdbcTemplate.query(sql, medicamentoRowMapper);
    }
    
    // Obtener medicamentos con stock bajo
    public List<Medicamento> findStockBajo() {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM medicamento m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE m.medicamento_stock <= m.medicamento_stock_min
            ORDER BY m.medicamento_stock
            """;
        return jdbcTemplate.query(sql, medicamentoRowMapper);
    }
}