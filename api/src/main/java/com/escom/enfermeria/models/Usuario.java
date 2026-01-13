package com.escom.enfermeria.models;

import java.time.LocalDateTime;

public class Usuario {
    private int usuarioId;
    private String usuarioNombre;
    private String usuarioApePat;
    private String usuarioApeMat;
    private String usuarioCorreo;
    private String usuarioPass; // Hash de la contraseña
    private LocalDateTime usuarioUltAcc;
    private LocalDateTime usuarioFecReg;
    private boolean usuarioActivo;
    private int rolId;
    private String rolNombre;
    
    // Constructores
    public Usuario() {}
    
    // Getters y Setters
    public int getUsuarioId() { 
        return usuarioId; 
    }
    
    public void setUsuarioId(int usuarioId) { 
        this.usuarioId = usuarioId; 
    }
    
    public String getUsuarioNombre() { 
        return usuarioNombre; 
    }
    
    public void setUsuarioNombre(String usuarioNombre) { 
        this.usuarioNombre = usuarioNombre; 
    }
    
    public String getUsuarioApePat() { 
        return usuarioApePat; 
    }
    
    public void setUsuarioApePat(String usuarioApePat) { 
        this.usuarioApePat = usuarioApePat; 
    }
    
    public String getUsuarioApeMat() { 
        return usuarioApeMat; 
    }
    
    public void setUsuarioApeMat(String usuarioApeMat) { 
        this.usuarioApeMat = usuarioApeMat; 
    }
    
    public String getUsuarioCorreo() { 
        return usuarioCorreo; 
    }
    
    public void setUsuarioCorreo(String usuarioCorreo) { 
        this.usuarioCorreo = usuarioCorreo; 
    }
    
    public String getUsuarioPass() { 
        return usuarioPass; 
    }
    
    public void setUsuarioPass(String usuarioPass) { 
        this.usuarioPass = usuarioPass; 
    }
    
    public LocalDateTime getUsuarioUltAcc() { 
        return usuarioUltAcc; 
    }
    
    public void setUsuarioUltAcc(LocalDateTime usuarioUltAcc) { 
        this.usuarioUltAcc = usuarioUltAcc; 
    }
    
    public LocalDateTime getUsuarioFecReg() { 
        return usuarioFecReg; 
    }
    
    public void setUsuarioFecReg(LocalDateTime usuarioFecReg) { 
        this.usuarioFecReg = usuarioFecReg; 
    }
    
    public boolean isUsuarioActivo() { 
        return usuarioActivo; 
    }
    
    public void setUsuarioActivo(boolean usuarioActivo) { 
        this.usuarioActivo = usuarioActivo; 
    }
    
    public int getRolId() { 
        return rolId; 
    }
    
    public void setRolId(int rolId) { 
        this.rolId = rolId; 
    }
    
    public String getRolNombre() { 
        return rolNombre; 
    }
    
    public void setRolNombre(String rolNombre) { 
        this.rolNombre = rolNombre; 
    }
    
    // Método toString para logging
    @Override
    public String toString() {
        return String.format(
            "Usuario{id=%d, nombre='%s %s', correo='%s', rol='%s', activo=%s}",
            usuarioId,
            usuarioNombre,
            usuarioApePat,
            usuarioCorreo,
            rolNombre,
            usuarioActivo
        );
    }
    
    // Método para obtener nombre completo
    public String getNombreCompleto() {
        StringBuilder nombreCompleto = new StringBuilder();
        nombreCompleto.append(usuarioNombre);
        
        if (usuarioApePat != null && !usuarioApePat.isEmpty()) {
            nombreCompleto.append(" ").append(usuarioApePat);
        }
        
        if (usuarioApeMat != null && !usuarioApeMat.isEmpty()) {
            nombreCompleto.append(" ").append(usuarioApeMat);
        }
        
        return nombreCompleto.toString();
    }
}