package com.escom.enfermeria.controllers;

import com.escom.enfermeria.dao.MedicamentoDAO;
import com.escom.enfermeria.models.Medicamento;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medicamentos")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicamentoController {
    
    private final MedicamentoDAO medicamentoDAO;
    
    public MedicamentoController(MedicamentoDAO medicamentoDAO) {
        this.medicamentoDAO = medicamentoDAO;
    }
    
    // GET: Obtener todos los medicamentos
    @GetMapping
    public ResponseEntity<?> getAllMedicamentos() {
        try {
            List<Medicamento> medicamentos = medicamentoDAO.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", medicamentos.size());
            response.put("medicamentos", medicamentos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error al obtener medicamentos: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener medicamento por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicamentoById(@PathVariable Integer id) {
        try {
            Medicamento medicamento = medicamentoDAO.findById(id);
            if (medicamento != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("medicamento", medicamento);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Medicamento no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // POST: Crear nuevo medicamento
    @PostMapping
    public ResponseEntity<?> createMedicamento(@RequestBody Map<String, Object> medicamentoData) {
        try {
            // Validar datos requeridos
            if (!medicamentoData.containsKey("medicamentoNom") || !medicamentoData.containsKey("medicamentoStock")) {
                return errorResponse("Nombre y stock son requeridos", HttpStatus.BAD_REQUEST);
            }
            
            Medicamento medicamento = new Medicamento();
            medicamento.setMedicamentoNom((String) medicamentoData.get("medicamentoNom"));
            medicamento.setMedicamentoDesc((String) medicamentoData.getOrDefault("medicamentoDesc", ""));
            
            // Manejar fechas
            if (medicamentoData.get("medicamentoFecComp") != null) {
                medicamento.setMedicamentoFecComp(LocalDate.parse((String) medicamentoData.get("medicamentoFecComp")));
            }
            if (medicamentoData.get("medicamentoFecCad") != null) {
                medicamento.setMedicamentoFecCad(LocalDate.parse((String) medicamentoData.get("medicamentoFecCad")));
            }
            
            medicamento.setMedicamentoLote((String) medicamentoData.getOrDefault("medicamentoLote", ""));
            medicamento.setMedicamentoLaboratorio((String) medicamentoData.getOrDefault("medicamentoLaboratorio", ""));
            
            // Estado por defecto
            String estado = (String) medicamentoData.getOrDefault("medicamentoEstado", "DISPONIBLE");
            medicamento.setMedicamentoEstado(estado);
            
            // Stock y precios
            medicamento.setMedicamentoStock(Integer.parseInt(medicamentoData.get("medicamentoStock").toString()));
            medicamento.setMedicamentoStockMin(Integer.parseInt(medicamentoData.getOrDefault("medicamentoStockMin", "10").toString()));
            
            if (medicamentoData.get("medicamentoPrecio") != null) {
                medicamento.setMedicamentoPrecio(new BigDecimal(medicamentoData.get("medicamentoPrecio").toString()));
            } else {
                medicamento.setMedicamentoPrecio(BigDecimal.ZERO);
            }
            
            // Categoría (puede ser null)
            if (medicamentoData.get("categoriaId") != null) {
                medicamento.setCategoriaId(Integer.parseInt(medicamentoData.get("categoriaId").toString()));
            }
            
            Medicamento nuevoMedicamento = medicamentoDAO.create(medicamento);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Medicamento creado exitosamente");
            response.put("medicamento", nuevoMedicamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return errorResponse("Error al crear medicamento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PUT: Actualizar medicamento
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicamento(@PathVariable Integer id, @RequestBody Map<String, Object> medicamentoData) {
        try {
            // Verificar que existe
            Medicamento existing = medicamentoDAO.findById(id);
            if (existing == null) {
                return errorResponse("Medicamento no encontrado", HttpStatus.NOT_FOUND);
            }
            
            // Actualizar solo los campos proporcionados
            if (medicamentoData.containsKey("medicamentoNom")) {
                existing.setMedicamentoNom((String) medicamentoData.get("medicamentoNom"));
            }
            if (medicamentoData.containsKey("medicamentoDesc")) {
                existing.setMedicamentoDesc((String) medicamentoData.get("medicamentoDesc"));
            }
            if (medicamentoData.containsKey("medicamentoFecComp")) {
                existing.setMedicamentoFecComp(LocalDate.parse((String) medicamentoData.get("medicamentoFecComp")));
            }
            if (medicamentoData.containsKey("medicamentoFecCad")) {
                existing.setMedicamentoFecCad(LocalDate.parse((String) medicamentoData.get("medicamentoFecCad")));
            }
            if (medicamentoData.containsKey("medicamentoLote")) {
                existing.setMedicamentoLote((String) medicamentoData.get("medicamentoLote"));
            }
            if (medicamentoData.containsKey("medicamentoLaboratorio")) {
                existing.setMedicamentoLaboratorio((String) medicamentoData.get("medicamentoLaboratorio"));
            }
            if (medicamentoData.containsKey("medicamentoEstado")) {
                existing.setMedicamentoEstado((String) medicamentoData.get("medicamentoEstado"));
            }
            if (medicamentoData.containsKey("medicamentoStock")) {
                existing.setMedicamentoStock(Integer.parseInt(medicamentoData.get("medicamentoStock").toString()));
            }
            if (medicamentoData.containsKey("medicamentoStockMin")) {
                existing.setMedicamentoStockMin(Integer.parseInt(medicamentoData.get("medicamentoStockMin").toString()));
            }
            if (medicamentoData.containsKey("medicamentoPrecio")) {
                existing.setMedicamentoPrecio(new BigDecimal(medicamentoData.get("medicamentoPrecio").toString()));
            }
            if (medicamentoData.containsKey("categoriaId")) {
                existing.setCategoriaId(Integer.parseInt(medicamentoData.get("categoriaId").toString()));
            }
            
            Medicamento updated = medicamentoDAO.update(existing);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Medicamento actualizado exitosamente");
            response.put("medicamento", updated);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return errorResponse("Error al actualizar medicamento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE: Eliminar medicamento
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicamento(@PathVariable Integer id) {
        try {
            boolean deleted = medicamentoDAO.delete(id);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Medicamento eliminado exitosamente");
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Medicamento no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error al eliminar medicamento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Buscar por nombre
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            List<Medicamento> medicamentos = medicamentoDAO.findByNombre(nombre);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", medicamentos.size());
            response.put("medicamentos", medicamentos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error en búsqueda: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> getByEstado(@PathVariable String estado) {
        try {
            List<Medicamento> medicamentos = medicamentoDAO.findByEstado(estado.toUpperCase());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", medicamentos.size());
            response.put("medicamentos", medicamentos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Próximos a caducar
    @GetMapping("/proximos-caducar")
    public ResponseEntity<?> getProximosCaducar() {
        try {
            List<Medicamento> medicamentos = medicamentoDAO.findProximosCaducar();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", medicamentos.size());
            response.put("medicamentos", medicamentos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Stock bajo
    @GetMapping("/stock-bajo")
    public ResponseEntity<?> getStockBajo() {
        try {
            List<Medicamento> medicamentos = medicamentoDAO.findStockBajo();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", medicamentos.size());
            response.put("medicamentos", medicamentos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Estadísticas
    @GetMapping("/estadisticas")
    public ResponseEntity<?> getEstadisticas() {
        try {
            Integer total = medicamentoDAO.count();
            List<Medicamento> stockBajo = medicamentoDAO.findStockBajo();
            List<Medicamento> proximosCaducar = medicamentoDAO.findProximosCaducar();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalMedicamentos", total);
            response.put("stockBajo", stockBajo.size());
            response.put("proximosCaducar", proximosCaducar.size());
            
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