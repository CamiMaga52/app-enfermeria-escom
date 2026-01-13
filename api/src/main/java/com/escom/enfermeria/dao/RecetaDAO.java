package com.escom.enfermeria.dao;

import com.escom.enfermeria.models.Receta;
import com.escom.enfermeria.models.DetalleReceta;
import com.escom.enfermeria.models.RecetaCompleta;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class RecetaDAO {
    
    private final JdbcTemplate jdbcTemplate;
    
    public RecetaDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // RowMapper para Receta
    private final RowMapper<Receta> recetaRowMapper = new RowMapper<Receta>() {
        @Override
        public Receta mapRow(ResultSet rs, int rowNum) throws SQLException {
            Receta receta = new Receta();
            
            receta.setRecetaId(rs.getInt("receta_id"));
            receta.setRecetaFolio(rs.getString("receta_folio"));
            
            if (rs.getTimestamp("receta_fecha") != null) {
                receta.setRecetaFecha(rs.getTimestamp("receta_fecha").toLocalDateTime());
            }
            
            receta.setRecetaDiag(rs.getString("receta_diag"));
            receta.setRecetaObs(rs.getString("receta_obs"));
            receta.setRecetaEstado(rs.getString("receta_estado"));
            receta.setPacienteId(rs.getInt("paciente_id"));
            receta.setUsuarioId(rs.getInt("usuario_id"));
            
            // Información adicional para mostrar
            try {
                receta.setPacienteNombre(rs.getString("paciente_nombre"));
            } catch (SQLException e) {
                // Columna no presente, ignorar
            }
            
            try {
                receta.setUsuarioNombre(rs.getString("usuario_nombre"));
            } catch (SQLException e) {
                // Columna no presente, ignorar
            }
            
            if (rs.getTimestamp("created_at") != null) {
                receta.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            }
            
            return receta;
        }
    };
    
    // RowMapper para DetalleReceta
    private final RowMapper<DetalleReceta> detalleRecetaRowMapper = new RowMapper<DetalleReceta>() {
        @Override
        public DetalleReceta mapRow(ResultSet rs, int rowNum) throws SQLException {
            DetalleReceta detalle = new DetalleReceta();
            
            detalle.setDetRecetaId(rs.getInt("det_receta_id"));
            detalle.setDetRecetaMed(rs.getString("det_receta_med"));
            detalle.setDetRecetaCant(rs.getInt("det_receta_cant"));
            detalle.setDetRecetaDosis(rs.getString("det_receta_dosis"));
            detalle.setDetRecetaDur(rs.getString("det_receta_dur"));
            detalle.setDetRecetaIndicaciones(rs.getString("det_receta_indicaciones"));
            detalle.setRecetaId(rs.getInt("receta_id"));
            
            Integer medicamentoId = rs.getInt("medicamento_id");
            if (!rs.wasNull()) {
                detalle.setMedicamentoId(medicamentoId);
            }
            
            // Información adicional para mostrar
            try {
                detalle.setMedicamentoNombre(rs.getString("medicamento_nom"));
            } catch (SQLException e) {
                // Columna no presente, ignorar
            }
            
            if (rs.getTimestamp("created_at") != null) {
                detalle.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            }
            
            return detalle;
        }
    };
    
    // Generar folio único
    private String generarFolio() {
        LocalDateTime ahora = LocalDateTime.now();
        String año = String.valueOf(ahora.getYear()).substring(2);
        String mes = String.format("%02d", ahora.getMonthValue());
        String dia = String.format("%02d", ahora.getDayOfMonth());
        String random = String.format("%03d", (int)(Math.random() * 1000));
        return "REC-" + año + mes + dia + "-" + random;
    }
    
    // CREATE: Insertar nueva receta con detalles
    @Transactional
    public RecetaCompleta create(Receta receta, List<DetalleReceta> detalles) {
        // Generar folio si no existe
        if (receta.getRecetaFolio() == null || receta.getRecetaFolio().isEmpty()) {
            receta.setRecetaFolio(generarFolio());
        }
        
        // Insertar receta
        String sqlReceta = """
            INSERT INTO receta (
                receta_folio, receta_fecha, receta_diag, receta_obs,
                receta_estado, paciente_id, usuario_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            """;
        
        Receta nuevaReceta = jdbcTemplate.queryForObject(sqlReceta, recetaRowMapper,
            receta.getRecetaFolio(),
            receta.getRecetaFecha() != null ? receta.getRecetaFecha() : LocalDateTime.now(),
            receta.getRecetaDiag(),
            receta.getRecetaObs(),
            receta.getRecetaEstado() != null ? receta.getRecetaEstado() : "ACTIVA",
            receta.getPacienteId(),
            receta.getUsuarioId()
        );
        
        // Insertar detalles
        if (detalles != null && !detalles.isEmpty()) {
            String sqlDetalle = """
                INSERT INTO detalle_receta (
                    det_receta_med, det_receta_cant, det_receta_dosis,
                    det_receta_dur, det_receta_indicaciones, receta_id, medicamento_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """;
            
            for (DetalleReceta detalle : detalles) {
                jdbcTemplate.update(sqlDetalle,
                    detalle.getDetRecetaMed(),
                    detalle.getDetRecetaCant(),
                    detalle.getDetRecetaDosis(),
                    detalle.getDetRecetaDur(),
                    detalle.getDetRecetaIndicaciones(),
                    nuevaReceta.getRecetaId(),
                    detalle.getMedicamentoId()
                );
            }
        }
        
        // Obtener receta completa con detalles
        return findRecetaCompletaById(nuevaReceta.getRecetaId());
    }
    
    // READ: Obtener todas las recetas
    public List<Receta> findAll() {
        String sql = """
            SELECT r.*, 
                   p.paciente_nombre,
                   u.usuario_nombre || ' ' || u.usuario_ape_pat as usuario_nombre
            FROM receta r
            LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
            LEFT JOIN usuario u ON r.usuario_id = u.usuario_id
            ORDER BY r.receta_id DESC
            """;
        return jdbcTemplate.query(sql, recetaRowMapper);
    }
    
    // READ: Obtener receta por ID
    public Receta findById(Integer id) {
        try {
            String sql = """
                SELECT r.*, 
                       p.paciente_nombre,
                       u.usuario_nombre || ' ' || u.usuario_ape_pat as usuario_nombre
                FROM receta r
                LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
                LEFT JOIN usuario u ON r.usuario_id = u.usuario_id
                WHERE r.receta_id = ?
                """;
            return jdbcTemplate.queryForObject(sql, recetaRowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }
    
    // READ: Obtener receta completa por ID (con detalles)
    public RecetaCompleta findRecetaCompletaById(Integer id) {
        Receta receta = findById(id);
        if (receta == null) {
            return null;
        }
        
        // Obtener detalles
        String sqlDetalles = """
            SELECT dr.*, m.medicamento_nom
            FROM detalle_receta dr
            LEFT JOIN medicamento m ON dr.medicamento_id = m.medicamento_id
            WHERE dr.receta_id = ?
            ORDER BY dr.det_receta_id
            """;
        List<DetalleReceta> detalles = jdbcTemplate.query(sqlDetalles, detalleRecetaRowMapper, id);
        
        return new RecetaCompleta(receta, detalles);
    }
    
    // READ: Buscar recetas por término
    public List<Receta> findByTermino(String termino) {
        String sql = """
            SELECT r.*, 
                   p.paciente_nombre,
                   u.usuario_nombre || ' ' || u.usuario_ape_pat as usuario_nombre
            FROM receta r
            LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
            LEFT JOIN usuario u ON r.usuario_id = u.usuario_id
            WHERE LOWER(r.receta_folio) LIKE LOWER(?)
               OR LOWER(r.receta_diag) LIKE LOWER(?)
               OR LOWER(p.paciente_nombre) LIKE LOWER(?)
            ORDER BY r.receta_fecha DESC
            """;
        String likeTermino = "%" + termino + "%";
        return jdbcTemplate.query(sql, recetaRowMapper, likeTermino, likeTermino, likeTermino);
    }
    
    // READ: Obtener recetas por paciente
    public List<Receta> findByPaciente(Integer pacienteId) {
        String sql = """
            SELECT r.*, 
                   p.paciente_nombre,
                   u.usuario_nombre || ' ' || u.usuario_ape_pat as usuario_nombre
            FROM receta r
            LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
            LEFT JOIN usuario u ON r.usuario_id = u.usuario_id
            WHERE r.paciente_id = ?
            ORDER BY r.receta_fecha DESC
            """;
        return jdbcTemplate.query(sql, recetaRowMapper, pacienteId);
    }
    
    // UPDATE: Actualizar receta
    @Transactional
    public RecetaCompleta update(Receta receta, List<DetalleReceta> detalles) {
        // Actualizar receta
        String sqlReceta = """
            UPDATE receta SET
                receta_diag = ?,
                receta_obs = ?,
                paciente_id = ?
            WHERE receta_id = ?
            """;
        
        jdbcTemplate.update(sqlReceta,
            receta.getRecetaDiag(),
            receta.getRecetaObs(),
            receta.getPacienteId(),
            receta.getRecetaId()
        );
        
        // Eliminar detalles antiguos
        String sqlDeleteDetalles = "DELETE FROM detalle_receta WHERE receta_id = ?";
        jdbcTemplate.update(sqlDeleteDetalles, receta.getRecetaId());
        
        // Insertar nuevos detalles
        if (detalles != null && !detalles.isEmpty()) {
            String sqlDetalle = """
                INSERT INTO detalle_receta (
                    det_receta_med, det_receta_cant, det_receta_dosis,
                    det_receta_dur, det_receta_indicaciones, receta_id, medicamento_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """;
            
            for (DetalleReceta detalle : detalles) {
                jdbcTemplate.update(sqlDetalle,
                    detalle.getDetRecetaMed(),
                    detalle.getDetRecetaCant(),
                    detalle.getDetRecetaDosis(),
                    detalle.getDetRecetaDur(),
                    detalle.getDetRecetaIndicaciones(),
                    receta.getRecetaId(),
                    detalle.getMedicamentoId()
                );
            }
        }
        
        return findRecetaCompletaById(receta.getRecetaId());
    }
    
    // UPDATE: Cambiar estado de receta
    public int cambiarEstado(Integer id, String estado) {
        String sql = """
            UPDATE receta SET
                receta_estado = ?
            WHERE receta_id = ?
            """;
        return jdbcTemplate.update(sql, estado, id);
    }
    
    // DELETE: Eliminar receta
    @Transactional
    public boolean delete(Integer id) {
        // Primero eliminar detalles
        String sqlDeleteDetalles = "DELETE FROM detalle_receta WHERE receta_id = ?";
        jdbcTemplate.update(sqlDeleteDetalles, id);
        
        // Luego eliminar receta
        String sqlDeleteReceta = "DELETE FROM receta WHERE receta_id = ?";
        int rowsAffected = jdbcTemplate.update(sqlDeleteReceta, id);
        return rowsAffected > 0;
    }
    
    // Contar total de recetas
    public Integer count() {
        String sql = "SELECT COUNT(*) FROM receta";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
    
    // Contar recetas por estado
    public Integer countByEstado(String estado) {
        try {
            String sql = "SELECT COUNT(*) FROM receta WHERE receta_estado = ?";
            return jdbcTemplate.queryForObject(sql, Integer.class, estado);
        } catch (Exception e) {
            return 0;
        }
    }
    
    // Obtener estadísticas de recetas
    public List<Object[]> getEstadisticasRecetasPorMes() {
        String sql = """
            SELECT 
                EXTRACT(YEAR FROM receta_fecha) as año,
                EXTRACT(MONTH FROM receta_fecha) as mes,
                COUNT(*) as total,
                SUM(CASE WHEN receta_estado = 'COMPLETADA' THEN 1 ELSE 0 END) as completadas
            FROM receta
            WHERE receta_fecha >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY EXTRACT(YEAR FROM receta_fecha), EXTRACT(MONTH FROM receta_fecha)
            ORDER BY año DESC, mes DESC
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new Object[]{
                rs.getInt("año"),
                rs.getInt("mes"),
                rs.getInt("total"),
                rs.getInt("completadas")
            });
    }
}