package com.escom.enfermeria.controllers;

import com.escom.enfermeria.dao.UsuarioDAO;
import com.escom.enfermeria.models.LoginRequest;
import com.escom.enfermeria.models.Usuario;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private final UsuarioDAO usuarioDAO;
    
    public AuthController(UsuarioDAO usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }
    
    // ========== LOGIN PARA DESARROLLO (sin verificación real de password) ==========
    
    @PostMapping("/login-dev")
    public ResponseEntity<?> loginDesarrollo(@RequestBody LoginRequest loginRequest) {
        System.out.println("🔐 [DEV] Intento de login: " + loginRequest.getCorreo());
        
        try {
            // Validar entrada
            if (loginRequest.getCorreo() == null || loginRequest.getCorreo().trim().isEmpty()) {
                return errorResponse("Correo es requerido", HttpStatus.BAD_REQUEST);
            }
            
            String correo = loginRequest.getCorreo().trim().toLowerCase();
            
            // En desarrollo, solo validamos que haya un password (cualquiera)
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return errorResponse("Password es requerido", HttpStatus.BAD_REQUEST);
            }
            
            // MODO DESARROLLO: Solo logueamos el password (no lo verificamos contra BD)
            System.out.println("⚠️  MODO DESARROLLO: Password proporcionado: [" + 
                             loginRequest.getPassword().trim() + "] - No se verifica contra BD");
            
            Usuario usuario = usuarioDAO.loginSinPassword(correo);
            
            if (usuario != null) {
                System.out.println("✅ [DEV] Login exitoso para: " + usuario.getUsuarioCorreo());
                System.out.println("📝 Rol del usuario: " + usuario.getRolNombre());
                return successResponse(usuario, "Login exitoso (modo desarrollo)");
            } else {
                System.out.println("❌ [DEV] Usuario no encontrado o inactivo: " + correo);
                return errorResponse("Usuario no encontrado o inactivo", HttpStatus.UNAUTHORIZED);
            }
            
        } catch (Exception e) {
            System.err.println("❌ [DEV] Error en login: " + e.getMessage());
            e.printStackTrace();
            return errorResponse("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // ========== ENDPOINTS PARA PRUEBAS ==========
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "API funcionando");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("modo", "DESARROLLO");
        response.put("mensaje", "Sistema de Inventario - Enfermería ESCOM");
        response.put("version", "1.0.0");
        
        // Agregar endpoints disponibles
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("login", "POST /auth/login-dev");
        endpoints.put("health", "GET  /auth/health");
        endpoints.put("usuarios", "GET  /auth/usuarios");
        endpoints.put("test", "GET  /auth/test");
        endpoints.put("check-user", "GET  /auth/check-user/{correo}");
        
        response.put("endpoints", endpoints);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "enfermeria-api");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        
        try {
            Integer dbTest = usuarioDAO.testConnection();
            Integer userCount = usuarioDAO.countUsuarios();
            List<Usuario> usuarios = usuarioDAO.getAllUsuarios();
            
            response.put("database", dbTest != null ? "CONNECTED" : "DISCONNECTED");
            response.put("totalUsuarios", userCount);
            response.put("databaseName", "enfermeria_escom");
            
            // Información útil para desarrollo
            if (usuarios != null && !usuarios.isEmpty()) {
                List<String> correos = usuarios.stream()
                    .map(Usuario::getUsuarioCorreo)
                    .limit(5)
                    .toList();
                response.put("usuariosEjemplo", correos);
            }
            
            response.put("mensaje", "✅ Backend funcionando correctamente");
            
        } catch (Exception e) {
            response.put("database", "ERROR: " + e.getMessage());
            response.put("mensaje", "⚠️  Error en conexión a BD");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        try {
            List<Usuario> usuarios = usuarioDAO.getAllUsuarios();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", usuarios.size());
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            // Crear lista simplificada de usuarios para respuesta
            List<Map<String, Object>> usuariosSimplificados = usuarios.stream()
                .map(u -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", u.getUsuarioId());
                    userMap.put("nombre", u.getUsuarioNombre() + " " + u.getUsuarioApePat());
                    userMap.put("correo", u.getUsuarioCorreo());
                    userMap.put("rol", u.getRolNombre());
                    userMap.put("activo", u.isUsuarioActivo());
                    return userMap;
                })
                .toList();
            
            response.put("usuarios", usuariosSimplificados);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo usuarios: " + e.getMessage());
            return errorResponse("Error obteniendo usuarios: " + e.getMessage(), 
                               HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/check-user/{correo}")
    public ResponseEntity<?> checkUsuario(@PathVariable String correo) {
        try {
            System.out.println("🔍 Check usuario: " + correo);
            
            Usuario usuario = usuarioDAO.loginSinPassword(correo.trim().toLowerCase());
            
            if (usuario != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("existe", true);
                userData.put("id", usuario.getUsuarioId());
                userData.put("nombreCompleto", usuario.getUsuarioNombre() + " " + 
                           usuario.getUsuarioApePat() + 
                           (usuario.getUsuarioApeMat() != null ? " " + usuario.getUsuarioApeMat() : ""));
                userData.put("correo", usuario.getUsuarioCorreo());
                userData.put("rol", usuario.getRolNombre());
                userData.put("rolId", usuario.getRolId());
                userData.put("activo", usuario.isUsuarioActivo());
                userData.put("fechaRegistro", usuario.getUsuarioFecReg());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Usuario encontrado");
                response.put("usuario", userData);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado: " + correo);
                response.put("sugerencias", List.of(
                    "admin@escom.mx",
                    "enfermera@escom.mx", 
                    "medico@escom.mx",
                    "maria.garcia@escom.ipn.mx",
                    "carlos.lopez@escom.ipn.mx"
                ));
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error check usuario: " + e.getMessage());
            return errorResponse("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // ========== MÉTODOS PRIVADOS DE AYUDA ==========
    
    private ResponseEntity<Map<String, Object>> successResponse(Usuario usuario, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", usuario.getUsuarioId());
        userData.put("nombre", usuario.getUsuarioNombre() + " " + usuario.getUsuarioApePat());
        userData.put("nombreCompleto", usuario.getUsuarioNombre() + " " + 
                    usuario.getUsuarioApePat() + 
                    (usuario.getUsuarioApeMat() != null ? " " + usuario.getUsuarioApeMat() : ""));
        userData.put("correo", usuario.getUsuarioCorreo());
        userData.put("rol", usuario.getRolNombre());
        userData.put("rolId", usuario.getRolId());
        userData.put("activo", usuario.isUsuarioActivo());
        userData.put("fechaRegistro", usuario.getUsuarioFecReg());
        
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }
    
    private ResponseEntity<Map<String, Object>> errorResponse(String error, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", error);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("statusCode", status.value());
        return ResponseEntity.status(status).body(response);
    }
    
    // Endpoint simple para verificar que el servidor responde
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong - " + java.time.LocalDateTime.now());
    }
}