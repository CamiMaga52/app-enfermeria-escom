package com.escom.enfermeria.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class Receta {
    private Integer recetaId;
    private String recetaFolio;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime recetaFecha;
    
    private String recetaDiag;
    private String recetaObs;
    private String recetaEstado; // ACTIVA, COMPLETADA, CANCELADA
    private Integer pacienteId;
    private Integer usuarioId;
    private String pacienteNombre; // Para mostrar
    private String usuarioNombre; // Para mostrar
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime created_at;
    
    // Constructores
    public Receta() {}
    
    public Receta(Integer recetaId, String recetaFolio, LocalDateTime recetaFecha,
                 String recetaDiag, String recetaObs, String recetaEstado,
                 Integer pacienteId, Integer usuarioId) {
        this.recetaId = recetaId;
        this.recetaFolio = recetaFolio;
        this.recetaFecha = recetaFecha;
        this.recetaDiag = recetaDiag;
        this.recetaObs = recetaObs;
        this.recetaEstado = recetaEstado;
        this.pacienteId = pacienteId;
        this.usuarioId = usuarioId;
    }
    
    // Getters y Setters
    public Integer getRecetaId() { return recetaId; }
    public void setRecetaId(Integer recetaId) { this.recetaId = recetaId; }
    
    public String getRecetaFolio() { return recetaFolio; }
    public void setRecetaFolio(String recetaFolio) { this.recetaFolio = recetaFolio; }
    
    public LocalDateTime getRecetaFecha() { return recetaFecha; }
    public void setRecetaFecha(LocalDateTime recetaFecha) { this.recetaFecha = recetaFecha; }
    
    public String getRecetaDiag() { return recetaDiag; }
    public void setRecetaDiag(String recetaDiag) { this.recetaDiag = recetaDiag; }
    
    public String getRecetaObs() { return recetaObs; }
    public void setRecetaObs(String recetaObs) { this.recetaObs = recetaObs; }
    
    public String getRecetaEstado() { return recetaEstado; }
    public void setRecetaEstado(String recetaEstado) { this.recetaEstado = recetaEstado; }
    
    public Integer getPacienteId() { return pacienteId; }
    public void setPacienteId(Integer pacienteId) { this.pacienteId = pacienteId; }
    
    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
    
    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }
    
    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }
    
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    
    @Override
    public String toString() {
        return "Receta{" +
                "id=" + recetaId +
                ", folio='" + recetaFolio + '\'' +
                ", diagnostico='" + recetaDiag + '\'' +
                ", estado='" + recetaEstado + '\'' +
                '}';
    }
}