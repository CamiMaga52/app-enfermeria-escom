package com.escom.enfermeria.dao;

import com.escom.enfermeria.models.Material;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MaterialDAO {
    
    private final JdbcTemplate jdbcTemplate;
    
    public MaterialDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // RowMapper para Material
    private final RowMapper<Material> materialRowMapper = new RowMapper<Material>() {
        @Override
        public Material mapRow(ResultSet rs, int rowNum) throws SQLException {
            Material material = new Material();
            
            material.setMaterialId(rs.getInt("material_id"));
            material.setMaterialNom(rs.getString("material_nom"));
            material.setMaterialDesc(rs.getString("material_desc"));
            
            // Manejar fecha que puede ser null
            if (rs.getDate("material_fec_comp") != null) {
                material.setMaterialFecComp(rs.getDate("material_fec_comp").toLocalDate());
            }
            
            material.setMaterialEstado(rs.getString("material_estado"));
            material.setMaterialStock(rs.getInt("material_stock"));
            material.setMaterialStockMin(rs.getInt("material_stock_min"));
            material.setMaterialPrecio(rs.getBigDecimal("material_precio"));
            material.setCategoriaId(rs.getInt("categoria_id"));
            
            // Obtener nombre de categoría si está en el resultado
            try {
                material.setCategoriaNombre(rs.getString("categoria_nom"));
            } catch (SQLException e) {
                // Columna no presente, ignorar
            }
            
            if (rs.getTimestamp("created_at") != null) {
                material.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            }
            if (rs.getTimestamp("updated_at") != null) {
                material.setUpdated_at(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            
            return material;
        }
    };
    
    // CREATE: Insertar nuevo material
    public Material create(Material material) {
        String sql = """
            INSERT INTO material (
                material_nom, material_desc, material_fec_comp,
                material_estado, material_stock, material_stock_min,
                material_precio, categoria_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            """;
        
        return jdbcTemplate.queryForObject(sql, materialRowMapper,
            material.getMaterialNom(),
            material.getMaterialDesc(),
            material.getMaterialFecComp(),
            material.getMaterialEstado(),
            material.getMaterialStock(),
            material.getMaterialStockMin(),
            material.getMaterialPrecio(),
            material.getCategoriaId()
        );
    }
    
    // READ: Obtener todos los materiales
    public List<Material> findAll() {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM material m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            ORDER BY m.material_id DESC
            """;
        return jdbcTemplate.query(sql, materialRowMapper);
    }
    
    // READ: Obtener material por ID
    public Material findById(Integer id) {
        try {
            String sql = """
                SELECT m.*, c.categoria_nom 
                FROM material m 
                LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
                WHERE m.material_id = ?
                """;
            return jdbcTemplate.queryForObject(sql, materialRowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }
    
    // READ: Buscar materiales por nombre
    public List<Material> findByNombre(String nombre) {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM material m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE LOWER(m.material_nom) LIKE LOWER(?) OR LOWER(m.material_desc) LIKE LOWER(?)
            ORDER BY m.material_nom
            """;
        return jdbcTemplate.query(sql, materialRowMapper, "%" + nombre + "%", "%" + nombre + "%");
    }
    
    // UPDATE: Actualizar material
    public Material update(Material material) {
        String sql = """
            UPDATE material SET
                material_nom = ?,
                material_desc = ?,
                material_fec_comp = ?,
                material_estado = ?,
                material_stock = ?,
                material_stock_min = ?,
                material_precio = ?,
                categoria_id = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE material_id = ?
            RETURNING *
            """;
        
        return jdbcTemplate.queryForObject(sql, materialRowMapper,
            material.getMaterialNom(),
            material.getMaterialDesc(),
            material.getMaterialFecComp(),
            material.getMaterialEstado(),
            material.getMaterialStock(),
            material.getMaterialStockMin(),
            material.getMaterialPrecio(),
            material.getCategoriaId(),
            material.getMaterialId()
        );
    }
    
    // UPDATE: Actualizar solo el stock
    public int updateStock(Integer id, Integer nuevoStock) {
        String sql = """
            UPDATE material SET
                material_stock = ?,
                material_estado = CASE 
                    WHEN ? <= 0 THEN 'AGOTADO'
                    WHEN ? < material_stock_min THEN 'RESERVADO'
                    ELSE 'DISPONIBLE'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE material_id = ?
            """;
        return jdbcTemplate.update(sql, nuevoStock, nuevoStock, nuevoStock, id);
    }
    
    // DELETE: Eliminar material
    public boolean delete(Integer id) {
        String sql = "DELETE FROM material WHERE material_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }
    
    // Contar total de materiales
    public Integer count() {
        String sql = "SELECT COUNT(*) FROM material";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
    
    // Obtener materiales por estado
    public List<Material> findByEstado(String estado) {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM material m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE m.material_estado = ?
            ORDER BY m.material_nom
            """;
        return jdbcTemplate.query(sql, materialRowMapper, estado);
    }
    
    // Obtener materiales con stock bajo
    public List<Material> findStockBajo() {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM material m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE m.material_stock <= m.material_stock_min
            ORDER BY m.material_stock
            """;
        return jdbcTemplate.query(sql, materialRowMapper);
    }
    
    // Obtener materiales en mantenimiento
    public List<Material> findEnMantenimiento() {
        String sql = """
            SELECT m.*, c.categoria_nom 
            FROM material m 
            LEFT JOIN categoria c ON m.categoria_id = c.categoria_id 
            WHERE m.material_estado = 'MANTENIMIENTO'
            ORDER BY m.material_nom
            """;
        return jdbcTemplate.query(sql, materialRowMapper);
    }
    
    // Método para verificar si hay medicamentos usando esta categoría
    public Integer countMaterialesByCategoriaId(Integer categoriaId) {
        String sql = "SELECT COUNT(*) FROM material WHERE categoria_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Integer.class, categoriaId);
        } catch (Exception e) {
            return 0;
        }
    }

    public JdbcTemplate getJdbcTemplate() {
    return this.jdbcTemplate;
}
}