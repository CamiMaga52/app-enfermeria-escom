package com.escom.enfermeria.controllers;

import com.escom.enfermeria.dao.RecetaDAO;
import com.escom.enfermeria.models.Receta;
import com.escom.enfermeria.models.DetalleReceta;
import com.escom.enfermeria.models.RecetaCompleta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recetas")
@CrossOrigin(origins = "http://localhost:5173")
public class RecetaController {
    
    private final RecetaDAO recetaDAO;
    
    public RecetaController(RecetaDAO recetaDAO) {
        this.recetaDAO = recetaDAO;
    }
    
    // GET: Obtener todas las recetas
    @GetMapping
    public ResponseEntity<?> getAllRecetas() {
        try {
            List<Receta> recetas = recetaDAO.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", recetas.size());
            response.put("recetas", recetas);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error al obtener recetas: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener receta por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecetaById(@PathVariable Integer id) {
        try {
            Receta receta = recetaDAO.findById(id);
            if (receta != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("receta", receta);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Receta no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener receta completa por ID (con detalles)
    @GetMapping("/{id}/completa")
    public ResponseEntity<?> getRecetaCompletaById(@PathVariable Integer id) {
        try {
            RecetaCompleta recetaCompleta = recetaDAO.findRecetaCompletaById(id);
            if (recetaCompleta != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("recetaCompleta", recetaCompleta);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Receta no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener recetas por paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> getRecetasByPaciente(@PathVariable Integer pacienteId) {
        try {
            List<Receta> recetas = recetaDAO.findByPaciente(pacienteId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", recetas.size());
            response.put("recetas", recetas);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // POST: Crear nueva receta
    @PostMapping
    public ResponseEntity<?> createReceta(@RequestBody Map<String, Object> recetaData) {
        try {
            // Validar datos requeridos
            if (!recetaData.containsKey("pacienteId") || 
                !recetaData.containsKey("recetaDiag")) {
                return errorResponse("Paciente y diagnóstico son requeridos", HttpStatus.BAD_REQUEST);
            }
            
            // Crear receta
            Receta receta = new Receta();
            receta.setRecetaDiag((String) recetaData.get("recetaDiag"));
            receta.setRecetaObs((String) recetaData.getOrDefault("recetaObs", ""));
            receta.setPacienteId(Integer.parseInt(recetaData.get("pacienteId").toString()));
            receta.setRecetaFecha(LocalDateTime.now());
            
            // TODO: Obtener usuario_id del usuario autenticado
            // Por ahora usamos un usuario por defecto (ID 1)
            receta.setUsuarioId(1);
            
            // Crear detalles
            List<DetalleReceta> detalles = new ArrayList<>();
            if (recetaData.containsKey("detalles")) {
            Object detallesObj = recetaData.get("detalles");
            if (detallesObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> detallesData = (List<Map<String, Object>>) detallesObj;
                
                for (Map<String, Object> detalleData : detallesData) {
                    DetalleReceta detalle = new DetalleReceta();
                    detalle.setDetRecetaMed((String) detalleData.get("detRecetaMed"));
                    
                    // Validar cantidad
                    Object cantidadObj = detalleData.get("detRecetaCant");
                    if (cantidadObj != null) {
                        detalle.setDetRecetaCant(Integer.parseInt(cantidadObj.toString()));
                    } else {
                        detalle.setDetRecetaCant(1); // Valor por defecto
                    }
                    
                    detalle.setDetRecetaDosis((String) detalleData.getOrDefault("detRecetaDosis", ""));
                    detalle.setDetRecetaDur((String) detalleData.getOrDefault("detRecetaDur", ""));
                    detalle.setDetRecetaIndicaciones((String) detalleData.getOrDefault("detRecetaIndicaciones", ""));
                    
                    Object medicamentoIdObj = detalleData.get("medicamentoId");
                    if (medicamentoIdObj != null) {
                        detalle.setMedicamentoId(Integer.parseInt(medicamentoIdObj.toString()));
                    }
                    
                    detalles.add(detalle);
                }
            }
        }
            
            RecetaCompleta nuevaReceta = recetaDAO.create(receta, detalles);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Receta creada exitosamente");
            response.put("recetaCompleta", nuevaReceta);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return errorResponse("Error al crear receta: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PUT: Actualizar receta
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReceta(@PathVariable Integer id, @RequestBody Map<String, Object> recetaData) {
        try {
            // Verificar que existe
            Receta existing = recetaDAO.findById(id);
            if (existing == null) {
                return errorResponse("Receta no encontrada", HttpStatus.NOT_FOUND);
            }
            
            // Verificar que esté activa
            if (!"ACTIVA".equals(existing.getRecetaEstado())) {
                return errorResponse("Solo se pueden editar recetas activas", HttpStatus.BAD_REQUEST);
            }
            
            // Actualizar receta
            if (recetaData.containsKey("recetaDiag")) {
                existing.setRecetaDiag((String) recetaData.get("recetaDiag"));
            }
            if (recetaData.containsKey("recetaObs")) {
                existing.setRecetaObs((String) recetaData.get("recetaObs"));
            }
            if (recetaData.containsKey("pacienteId")) {
                existing.setPacienteId(Integer.parseInt(recetaData.get("pacienteId").toString()));
            }
            
            // Crear detalles
            List<DetalleReceta> detalles = new ArrayList<>();
            if (recetaData.containsKey("detalles")) {
            Object detallesObj = recetaData.get("detalles");
            if (detallesObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> detallesData = (List<Map<String, Object>>) detallesObj;
                
                for (Map<String, Object> detalleData : detallesData) {
                    DetalleReceta detalle = new DetalleReceta();
                    detalle.setDetRecetaMed((String) detalleData.get("detRecetaMed"));
                    
                    // Validar cantidad
                    Object cantidadObj = detalleData.get("detRecetaCant");
                    if (cantidadObj != null) {
                        detalle.setDetRecetaCant(Integer.parseInt(cantidadObj.toString()));
                    } else {
                        detalle.setDetRecetaCant(1); // Valor por defecto
                    }
                    
                    detalle.setDetRecetaDosis((String) detalleData.getOrDefault("detRecetaDosis", ""));
                    detalle.setDetRecetaDur((String) detalleData.getOrDefault("detRecetaDur", ""));
                    detalle.setDetRecetaIndicaciones((String) detalleData.getOrDefault("detRecetaIndicaciones", ""));
                    
                    Object medicamentoIdObj = detalleData.get("medicamentoId");
                    if (medicamentoIdObj != null) {
                        detalle.setMedicamentoId(Integer.parseInt(medicamentoIdObj.toString()));
                    }
                    
                    detalles.add(detalle);
                }
            }
        }


            RecetaCompleta recetaActualizada = recetaDAO.update(existing, detalles);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Receta actualizada exitosamente");
            response.put("recetaCompleta", recetaActualizada);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return errorResponse("Error al actualizar receta: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PATCH: Cambiar estado de receta
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstadoReceta(@PathVariable Integer id, @RequestBody Map<String, Object> estadoData) {
        try {
            // Verificar que existe
            Receta existing = recetaDAO.findById(id);
            if (existing == null) {
                return errorResponse("Receta no encontrada", HttpStatus.NOT_FOUND);
            }
            
            if (!estadoData.containsKey("estado")) {
                return errorResponse("El estado es requerido", HttpStatus.BAD_REQUEST);
            }
            
            String nuevoEstado = (String) estadoData.get("estado");
            if (!"ACTIVA".equals(nuevoEstado) && !"COMPLETADA".equals(nuevoEstado) && !"CANCELADA".equals(nuevoEstado)) {
                return errorResponse("Estado inválido", HttpStatus.BAD_REQUEST);
            }
            
            int rowsAffected = recetaDAO.cambiarEstado(id, nuevoEstado);
            if (rowsAffected > 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Estado cambiado exitosamente a " + nuevoEstado);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Receta no encontrada", HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            return errorResponse("Error al cambiar estado: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE: Eliminar receta
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceta(@PathVariable Integer id) {
        try {
            boolean deleted = recetaDAO.delete(id);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Receta eliminada exitosamente");
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Receta no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error al eliminar receta: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Buscar por término
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorTermino(@RequestParam String termino) {
        try {
            List<Receta> recetas = recetaDAO.findByTermino(termino);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", recetas.size());
            response.put("recetas", recetas);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error en búsqueda: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Estadísticas
    @GetMapping("/estadisticas")
    public ResponseEntity<?> getEstadisticas() {
        try {
            Integer total = recetaDAO.count();
            Integer activas = recetaDAO.countByEstado("ACTIVA");
            Integer completadas = recetaDAO.countByEstado("COMPLETADA");
            Integer canceladas = recetaDAO.countByEstado("CANCELADA");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalRecetas", total);
            response.put("activas", activas);
            response.put("completadas", completadas);
            response.put("canceladas", canceladas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Método auxiliar para respuestas de error
    private ResponseEntity<Map<String, Object>> errorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return ResponseEntity.status(status).body(response);
    }
}