package com.escom.enfermeria.controllers;

import com.escom.enfermeria.dao.PacienteDAO;
import com.escom.enfermeria.models.Paciente;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin(origins = "http://localhost:5173")
public class PacienteController {
    
    private final PacienteDAO pacienteDAO;
    
    public PacienteController(PacienteDAO pacienteDAO) {
        this.pacienteDAO = pacienteDAO;
    }
    
    // GET: Obtener todos los pacientes
    @GetMapping
    public ResponseEntity<?> getAllPacientes() {
        try {
            List<Paciente> pacientes = pacienteDAO.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", pacientes.size());
            response.put("pacientes", pacientes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error al obtener pacientes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener paciente por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPacienteById(@PathVariable Integer id) {
        try {
            Paciente paciente = pacienteDAO.findById(id);
            if (paciente != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("paciente", paciente);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Paciente no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // POST: Crear nuevo paciente
    @PostMapping
    public ResponseEntity<?> createPaciente(@RequestBody Map<String, Object> pacienteData) {
        try {
            // Validar datos requeridos
            if (!pacienteData.containsKey("pacienteNombre") || 
                !pacienteData.containsKey("pacienteEscuela") ||
                !pacienteData.containsKey("pacienteEdad")) {
                return errorResponse("Nombre, escuela y edad son requeridos", HttpStatus.BAD_REQUEST);
            }
            
            Paciente paciente = new Paciente();
            paciente.setPacienteNombre((String) pacienteData.get("pacienteNombre"));
            paciente.setPacienteEscuela((String) pacienteData.get("pacienteEscuela"));
            
            // Validar y convertir edad
            try {
                Integer edad = Integer.parseInt(pacienteData.get("pacienteEdad").toString());
                if (edad < 1 || edad > 120) {
                    return errorResponse("La edad debe estar entre 1 y 120 años", HttpStatus.BAD_REQUEST);
                }
                paciente.setPacienteEdad(edad);
            } catch (NumberFormatException e) {
                return errorResponse("La edad debe ser un número válido", HttpStatus.BAD_REQUEST);
            }
            
            paciente.setPacienteTelefono((String) pacienteData.getOrDefault("pacienteTelefono", ""));
            paciente.setPacienteEmail((String) pacienteData.getOrDefault("pacienteEmail", ""));
            
            Paciente nuevoPaciente = pacienteDAO.create(paciente);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Paciente creado exitosamente");
            response.put("paciente", nuevoPaciente);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return errorResponse("Error al crear paciente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PUT: Actualizar paciente
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaciente(@PathVariable Integer id, @RequestBody Map<String, Object> pacienteData) {
        try {
            // Verificar que existe
            Paciente existing = pacienteDAO.findById(id);
            if (existing == null) {
                return errorResponse("Paciente no encontrado", HttpStatus.NOT_FOUND);
            }
            
            // Actualizar solo los campos proporcionados
            if (pacienteData.containsKey("pacienteNombre")) {
                existing.setPacienteNombre((String) pacienteData.get("pacienteNombre"));
            }
            if (pacienteData.containsKey("pacienteEscuela")) {
                existing.setPacienteEscuela((String) pacienteData.get("pacienteEscuela"));
            }
            if (pacienteData.containsKey("pacienteEdad")) {
                try {
                    Integer edad = Integer.parseInt(pacienteData.get("pacienteEdad").toString());
                    if (edad < 1 || edad > 120) {
                        return errorResponse("La edad debe estar entre 1 y 120 años", HttpStatus.BAD_REQUEST);
                    }
                    existing.setPacienteEdad(edad);
                } catch (NumberFormatException e) {
                    return errorResponse("La edad debe ser un número válido", HttpStatus.BAD_REQUEST);
                }
            }
            if (pacienteData.containsKey("pacienteTelefono")) {
                existing.setPacienteTelefono((String) pacienteData.get("pacienteTelefono"));
            }
            if (pacienteData.containsKey("pacienteEmail")) {
                existing.setPacienteEmail((String) pacienteData.get("pacienteEmail"));
            }
            
            Paciente updated = pacienteDAO.update(existing);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Paciente actualizado exitosamente");
            response.put("paciente", updated);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return errorResponse("Error al actualizar paciente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE: Eliminar paciente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaciente(@PathVariable Integer id) {
        try {
            // Verificar si hay recetas asociadas
            String checkSql = "SELECT COUNT(*) FROM receta WHERE paciente_id = ?";
            Integer recetasCount = pacienteDAO.getJdbcTemplate().queryForObject(checkSql, Integer.class, id);
            
            if (recetasCount != null && recetasCount > 0) {
                return errorResponse("No se puede eliminar el paciente porque tiene " + recetasCount + " receta(s) asociada(s)", HttpStatus.BAD_REQUEST);
            }
            
            boolean deleted = pacienteDAO.delete(id);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Paciente eliminado exitosamente");
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Paciente no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error al eliminar paciente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Buscar por término
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorTermino(@RequestParam String termino) {
        try {
            List<Paciente> pacientes = pacienteDAO.findByTermino(termino);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", pacientes.size());
            response.put("pacientes", pacientes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error en búsqueda: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Buscar por escuela
    @GetMapping("/escuela/{escuela}")
    public ResponseEntity<?> getByEscuela(@PathVariable String escuela) {
        try {
            List<Paciente> pacientes = pacienteDAO.findByEscuela(escuela);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", pacientes.size());
            response.put("pacientes", pacientes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Estadísticas
    @GetMapping("/estadisticas")
    public ResponseEntity<?> getEstadisticas() {
        try {
            Integer total = pacienteDAO.count();
            Double promedioEdad = pacienteDAO.promedioEdad();
            List<String> escuelasUnicas = pacienteDAO.findEscuelasUnicas();
            
            // Distribución por edad
            Integer menores = pacienteDAO.countByEdadRange(1, 17);
            Integer jovenes = pacienteDAO.countByEdadRange(18, 25);
            Integer adultos = pacienteDAO.countByEdadRange(26, 40);
            Integer mayores = pacienteDAO.countByEdadRange(41, 120);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalPacientes", total);
            response.put("promedioEdad", promedioEdad != null ? Math.round(promedioEdad * 10.0) / 10.0 : 0);
            response.put("escuelasUnicas", escuelasUnicas.size());
            response.put("distribucionEdad", Map.of(
                "menores", menores,
                "jovenes", jovenes,
                "adultos", adultos,
                "mayores", mayores
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Escuelas disponibles
    @GetMapping("/escuelas")
    public ResponseEntity<?> getEscuelas() {
        try {
            List<String> escuelas = pacienteDAO.findEscuelasUnicas();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("escuelas", escuelas);
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