package com.escom.enfermeria.controllers;

import com.escom.enfermeria.dao.MaterialDAO;
import com.escom.enfermeria.models.Material;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/materiales")
@CrossOrigin(origins = "http://localhost:5173")
public class MaterialController {
    
    private final MaterialDAO materialDAO;
    
    public MaterialController(MaterialDAO materialDAO) {
        this.materialDAO = materialDAO;
    }
    
    // GET: Obtener todos los materiales
    @GetMapping
    public ResponseEntity<?> getAllMateriales() {
        try {
            List<Material> materiales = materialDAO.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", materiales.size());
            response.put("materiales", materiales);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error al obtener materiales: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener material por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMaterialById(@PathVariable Integer id) {
        try {
            Material material = materialDAO.findById(id);
            if (material != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("material", material);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Material no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // POST: Crear nuevo material
    @PostMapping
    public ResponseEntity<?> createMaterial(@RequestBody Map<String, Object> materialData) {
        try {
            // Validar datos requeridos
            if (!materialData.containsKey("materialNom") || !materialData.containsKey("materialStock")) {
                return errorResponse("Nombre y stock son requeridos", HttpStatus.BAD_REQUEST);
            }
            
            Material material = new Material();
            material.setMaterialNom((String) materialData.get("materialNom"));
            material.setMaterialDesc((String) materialData.getOrDefault("materialDesc", ""));
            
            // Manejar fecha
            if (materialData.get("materialFecComp") != null) {
                material.setMaterialFecComp(LocalDate.parse((String) materialData.get("materialFecComp")));
            }
            
            // Estado por defecto
            String estado = (String) materialData.getOrDefault("materialEstado", "DISPONIBLE");
            material.setMaterialEstado(estado);
            
            // Stock y precios
            material.setMaterialStock(Integer.parseInt(materialData.get("materialStock").toString()));
            material.setMaterialStockMin(Integer.parseInt(materialData.getOrDefault("materialStockMin", "5").toString()));
            
            if (materialData.get("materialPrecio") != null) {
                material.setMaterialPrecio(new BigDecimal(materialData.get("materialPrecio").toString()));
            } else {
                material.setMaterialPrecio(BigDecimal.ZERO);
            }
            
            // Categoría (puede ser null)
            if (materialData.get("categoriaId") != null) {
                material.setCategoriaId(Integer.parseInt(materialData.get("categoriaId").toString()));
            }
            
            Material nuevoMaterial = materialDAO.create(material);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Material creado exitosamente");
            response.put("material", nuevoMaterial);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return errorResponse("Error al crear material: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PUT: Actualizar material
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaterial(@PathVariable Integer id, @RequestBody Map<String, Object> materialData) {
        try {
            // Verificar que existe
            Material existing = materialDAO.findById(id);
            if (existing == null) {
                return errorResponse("Material no encontrado", HttpStatus.NOT_FOUND);
            }
            
            // Actualizar solo los campos proporcionados
            if (materialData.containsKey("materialNom")) {
                existing.setMaterialNom((String) materialData.get("materialNom"));
            }
            if (materialData.containsKey("materialDesc")) {
                existing.setMaterialDesc((String) materialData.get("materialDesc"));
            }
            if (materialData.containsKey("materialFecComp")) {
                existing.setMaterialFecComp(LocalDate.parse((String) materialData.get("materialFecComp")));
            }
            if (materialData.containsKey("materialEstado")) {
                existing.setMaterialEstado((String) materialData.get("materialEstado"));
            }
            if (materialData.containsKey("materialStock")) {
                existing.setMaterialStock(Integer.parseInt(materialData.get("materialStock").toString()));
            }
            if (materialData.containsKey("materialStockMin")) {
                existing.setMaterialStockMin(Integer.parseInt(materialData.get("materialStockMin").toString()));
            }
            if (materialData.containsKey("materialPrecio")) {
                existing.setMaterialPrecio(new BigDecimal(materialData.get("materialPrecio").toString()));
            }
            if (materialData.containsKey("categoriaId")) {
                existing.setCategoriaId(Integer.parseInt(materialData.get("categoriaId").toString()));
            }
            
            Material updated = materialDAO.update(existing);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Material actualizado exitosamente");
            response.put("material", updated);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return errorResponse("Error al actualizar material: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE: Eliminar material
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Integer id) {
        try {
            boolean deleted = materialDAO.delete(id);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Material eliminado exitosamente");
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Material no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error al eliminar material: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Buscar por nombre
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            List<Material> materiales = materialDAO.findByNombre(nombre);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", materiales.size());
            response.put("materiales", materiales);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error en búsqueda: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> getByEstado(@PathVariable String estado) {
        try {
            List<Material> materiales = materialDAO.findByEstado(estado.toUpperCase());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", materiales.size());
            response.put("materiales", materiales);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Stock bajo
    @GetMapping("/stock-bajo")
    public ResponseEntity<?> getStockBajo() {
        try {
            List<Material> materiales = materialDAO.findStockBajo();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", materiales.size());
            response.put("materiales", materiales);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: En mantenimiento
    @GetMapping("/mantenimiento")
    public ResponseEntity<?> getEnMantenimiento() {
        try {
            List<Material> materiales = materialDAO.findEnMantenimiento();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", materiales.size());
            response.put("materiales", materiales);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Estadísticas
    @GetMapping("/estadisticas")
    public ResponseEntity<?> getEstadisticas() {
        try {
            Integer total = materialDAO.count();
            List<Material> stockBajo = materialDAO.findStockBajo();
            List<Material> enMantenimiento = materialDAO.findEnMantenimiento();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalMateriales", total);
            response.put("stockBajo", stockBajo.size());
            response.put("enMantenimiento", enMantenimiento.size());
            
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