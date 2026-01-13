package com.escom.enfermeria.controllers;

import com.escom.enfermeria.dao.CategoriaDAO;
import com.escom.enfermeria.models.Categoria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoriaController {
    
    private final CategoriaDAO categoriaDAO;
    
    public CategoriaController(CategoriaDAO categoriaDAO) {
        this.categoriaDAO = categoriaDAO;
    }
    
    // GET: Obtener todas las categorías
    @GetMapping
    public ResponseEntity<?> getAllCategorias() {
        try {
            List<Categoria> categorias = categoriaDAO.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", categorias.size());
            response.put("categorias", categorias);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error al obtener categorías: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // GET: Obtener categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoriaById(@PathVariable Integer id) {
        try {
            Categoria categoria = categoriaDAO.findById(id);
            if (categoria != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("categoria", categoria);
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Categoría no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // POST: Crear nueva categoría
    @PostMapping
    public ResponseEntity<?> createCategoria(@RequestBody Map<String, Object> categoriaData) {
        try {
            if (!categoriaData.containsKey("categoriaNom")) {
                return errorResponse("El nombre de la categoría es requerido", HttpStatus.BAD_REQUEST);
            }
            
            Categoria categoria = new Categoria();
            categoria.setCategoriaNom((String) categoriaData.get("categoriaNom"));
            categoria.setCategoriaDesc((String) categoriaData.getOrDefault("categoriaDesc", ""));
            
            Categoria nuevaCategoria = categoriaDAO.create(categoria);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Categoría creada exitosamente");
            response.put("categoria", nuevaCategoria);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return errorResponse("Error al crear categoría: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PUT: Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategoria(@PathVariable Integer id, @RequestBody Map<String, Object> categoriaData) {
        try {
            Categoria existing = categoriaDAO.findById(id);
            if (existing == null) {
                return errorResponse("Categoría no encontrada", HttpStatus.NOT_FOUND);
            }
            
            if (categoriaData.containsKey("categoriaNom")) {
                existing.setCategoriaNom((String) categoriaData.get("categoriaNom"));
            }
            if (categoriaData.containsKey("categoriaDesc")) {
                existing.setCategoriaDesc((String) categoriaData.get("categoriaDesc"));
            }
            
            Categoria updated = categoriaDAO.update(existing);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Categoría actualizada exitosamente");
            response.put("categoria", updated);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error al actualizar categoría: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE: Eliminar categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoria(@PathVariable Integer id) {
        try {
            // Verificar si hay medicamentos usando esta categoría
            Integer medicamentosCount = categoriaDAO.countMedicamentosByCategoriaId(id);
            
            if (medicamentosCount != null && medicamentosCount > 0) {
                return errorResponse("No se puede eliminar la categoría porque hay " + medicamentosCount + " medicamento(s) asociado(s)", HttpStatus.BAD_REQUEST);
            }
            
            boolean deleted = categoriaDAO.delete(id);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Categoría eliminada exitosamente");
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Categoría no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return errorResponse("Error al eliminar categoría: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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