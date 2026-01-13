package com.escom.enfermeria.models;

import java.util.List;

public class RecetaCompleta {
    private Receta receta;
    private List<DetalleReceta> detalles;
    
    public RecetaCompleta() {}
    
    public RecetaCompleta(Receta receta, List<DetalleReceta> detalles) {
        this.receta = receta;
        this.detalles = detalles;
    }
    
    // Getters y Setters
    public Receta getReceta() { return receta; }
    public void setReceta(Receta receta) { this.receta = receta; }
    
    public List<DetalleReceta> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleReceta> detalles) { this.detalles = detalles; }
}