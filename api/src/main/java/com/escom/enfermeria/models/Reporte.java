package com.escom.enfermeria.models;

import java.time.LocalDateTime;

public class Reporte {
    private Integer reporteId;
    private String reporteTipo;
    private LocalDateTime reporteFecha;
    private String reportePeriodo;
    private String reporteDesc;
    private String reporteUrl;
    private Integer usuarioId;
    private LocalDateTime created_at;
    
    // Constructor vacío
    public Reporte() {}
    
    // Constructor con parámetros
    public Reporte(Integer reporteId, String reporteTipo, LocalDateTime reporteFecha, 
                  String reportePeriodo, String reporteDesc, String reporteUrl, 
                  Integer usuarioId, LocalDateTime created_at) {
        this.reporteId = reporteId;
        this.reporteTipo = reporteTipo;
        this.reporteFecha = reporteFecha;
        this.reportePeriodo = reportePeriodo;
        this.reporteDesc = reporteDesc;
        this.reporteUrl = reporteUrl;
        this.usuarioId = usuarioId;
        this.created_at = created_at;
    }
    
    // Getters y Setters
    public Integer getReporteId() {
        return reporteId;
    }
    
    public void setReporteId(Integer reporteId) {
        this.reporteId = reporteId;
    }
    
    public String getReporteTipo() {
        return reporteTipo;
    }
    
    public void setReporteTipo(String reporteTipo) {
        this.reporteTipo = reporteTipo;
    }
    
    public LocalDateTime getReporteFecha() {
        return reporteFecha;
    }
    
    public void setReporteFecha(LocalDateTime reporteFecha) {
        this.reporteFecha = reporteFecha;
    }
    
    public String getReportePeriodo() {
        return reportePeriodo;
    }
    
    public void setReportePeriodo(String reportePeriodo) {
        this.reportePeriodo = reportePeriodo;
    }
    
    public String getReporteDesc() {
        return reporteDesc;
    }
    
    public void setReporteDesc(String reporteDesc) {
        this.reporteDesc = reporteDesc;
    }
    
    public String getReporteUrl() {
        return reporteUrl;
    }
    
    public void setReporteUrl(String reporteUrl) {
        this.reporteUrl = reporteUrl;
    }
    
    public Integer getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
}