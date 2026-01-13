package com.escom.enfermeria.controllers;

import com.escom.enfermeria.services.ReporteService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {
    
    private final ReporteService reporteService;
    
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }
    
    // GET: Obtener reporte de medicamentos en PDF
    @GetMapping("/medicamentos/pdf")
    public ResponseEntity<byte[]> generarReporteMedicamentos(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer año,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer usuarioId) {
        
        try {
            byte[] pdfBytes = reporteService.generarReporteMedicamentos(usuarioId, mes, año);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-medicamentos.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET: Obtener reporte de materiales en PDF
    @GetMapping("/materiales/pdf")
    public ResponseEntity<byte[]> generarReporteMateriales(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer año,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer usuarioId) {
        
        try {
            byte[] pdfBytes = reporteService.generarReporteMateriales(usuarioId, mes, año);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-materiales.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET: Obtener reporte de recetas en PDF
    @GetMapping("/recetas/pdf")
    public ResponseEntity<byte[]> generarReporteRecetas(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer año,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer usuarioId) {
        
        try {
            byte[] pdfBytes = reporteService.generarReporteRecetas(usuarioId, mes, año);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-recetas.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET: Obtener reporte consolidado en PDF
    @GetMapping("/consolidado/pdf")
    public ResponseEntity<byte[]> generarReporteConsolidado(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer año,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer usuarioId) {
        
        try {
            byte[] pdfBytes = reporteService.generarReporteConsolidado(usuarioId, mes, año);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-consolidado.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET: Obtener opciones de meses y años para filtros
    @GetMapping("/opciones-filtro")
    public ResponseEntity<Map<String, Object>> obtenerOpcionesFiltro() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Meses
            String[] meses = {
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            };
            response.put("meses", meses);
            
            // Años (2023, 2024, 2025)
            Integer[] años = {2023, 2024, 2025};
            response.put("años", años);
            
            // Mes y año actual
            java.time.LocalDate hoy = java.time.LocalDate.now();
            response.put("mesActual", hoy.getMonthValue());
            response.put("añoActual", hoy.getYear());
            
            response.put("success", true);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Error obteniendo opciones de filtro");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // GET: Obtener estadísticas para vista previa
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer año) {
        
        try {
            // Este endpoint devolvería estadísticas en JSON para mostrar en la vista previa
            // Por simplicidad, devolvemos datos de ejemplo
            Map<String, Object> estadisticas = new HashMap<>();
            estadisticas.put("medicamentos", 45);
            estadisticas.put("materiales", 28);
            estadisticas.put("recetas", 156);
            estadisticas.put("pacientes", 89);
            estadisticas.put("stockBajo", 12);
            estadisticas.put("proximosCaducar", 8);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("estadisticas", estadisticas);
            response.put("periodo", mes != null && año != null ? 
                String.format("%d/%d", mes, año) : "Todos los períodos");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Error obteniendo estadísticas");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}