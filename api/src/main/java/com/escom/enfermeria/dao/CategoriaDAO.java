package com.escom.enfermeria.dao;

import com.escom.enfermeria.models.Categoria;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CategoriaDAO {
    
    private final JdbcTemplate jdbcTemplate;
    
    public CategoriaDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    private final RowMapper<Categoria> categoriaRowMapper = new RowMapper<Categoria>() {
        @Override
        public Categoria mapRow(ResultSet rs, int rowNum) throws SQLException {
            Categoria categoria = new Categoria();
            categoria.setCategoriaId(rs.getInt("categoria_id"));
            categoria.setCategoriaNom(rs.getString("categoria_nom"));
            categoria.setCategoriaDesc(rs.getString("categoria_desc"));
            return categoria;
        }
    };
    
    // Obtener todas las categorías
    public List<Categoria> findAll() {
        String sql = "SELECT * FROM categoria ORDER BY categoria_nom";
        return jdbcTemplate.query(sql, categoriaRowMapper);
    }
    
    // Obtener categoría por ID
    public Categoria findById(Integer id) {
        try {
            String sql = "SELECT * FROM categoria WHERE categoria_id = ?";
            return jdbcTemplate.queryForObject(sql, categoriaRowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }
    
    // Crear nueva categoría
    public Categoria create(Categoria categoria) {
        String sql = """
            INSERT INTO categoria (categoria_nom, categoria_desc) 
            VALUES (?, ?) 
            RETURNING *
            """;
        return jdbcTemplate.queryForObject(sql, categoriaRowMapper,
            categoria.getCategoriaNom(),
            categoria.getCategoriaDesc()
        );
    }
    
    // Actualizar categoría
    public Categoria update(Categoria categoria) {
        String sql = """
            UPDATE categoria SET
                categoria_nom = ?,
                categoria_desc = ?
            WHERE categoria_id = ?
            RETURNING *
            """;
        return jdbcTemplate.queryForObject(sql, categoriaRowMapper,
            categoria.getCategoriaNom(),
            categoria.getCategoriaDesc(),
            categoria.getCategoriaId()
        );
    }
    
    // Eliminar categoría
    public boolean delete(Integer id) {
        String sql = "DELETE FROM categoria WHERE categoria_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }

        // Verificar si hay medicamentos usando esta categoría
    public Integer countMedicamentosByCategoriaId(Integer categoriaId) {
        String sql = "SELECT COUNT(*) FROM medicamento WHERE categoria_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Integer.class, categoriaId);
        } catch (Exception e) {
            return 0;
        }
    }
    
    // Método para acceder al jdbcTemplate si se necesita en el Controller
    public JdbcTemplate getJdbcTemplate() {
        return this.jdbcTemplate;
    }
}