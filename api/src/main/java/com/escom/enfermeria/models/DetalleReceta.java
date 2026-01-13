package com.escom.enfermeria.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class DetalleReceta {
    private Integer detRecetaId;
    private String detRecetaMed;
    private Integer detRecetaCant;
    private String detRecetaDosis;
    private String detRecetaDur;
    private String detRecetaIndicaciones;
    private Integer recetaId;
    private Integer medicamentoId;
    private String medicamentoNombre; // Para mostrar
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime created_at;
    
    // Constructores
    public DetalleReceta() {}
    
    public DetalleReceta(Integer detRecetaId, String detRecetaMed, Integer detRecetaCant,
                        String detRecetaDosis, String detRecetaDur, String detRecetaIndicaciones,
                        Integer recetaId, Integer medicamentoId) {
        this.detRecetaId = detRecetaId;
        this.detRecetaMed = detRecetaMed;
        this.detRecetaCant = detRecetaCant;
        this.detRecetaDosis = detRecetaDosis;
        this.detRecetaDur = detRecetaDur;
        this.detRecetaIndicaciones = detRecetaIndicaciones;
        this.recetaId = recetaId;
        this.medicamentoId = medicamentoId;
    }
    
    // Getters y Setters
    public Integer getDetRecetaId() { return detRecetaId; }
    public void setDetRecetaId(Integer detRecetaId) { this.detRecetaId = detRecetaId; }
    
    public String getDetRecetaMed() { return detRecetaMed; }
    public void setDetRecetaMed(String detRecetaMed) { this.detRecetaMed = detRecetaMed; }
    
    public Integer getDetRecetaCant() { return detRecetaCant; }
    public void setDetRecetaCant(Integer detRecetaCant) { this.detRecetaCant = detRecetaCant; }
    
    public String getDetRecetaDosis() { return detRecetaDosis; }
    public void setDetRecetaDosis(String detRecetaDosis) { this.detRecetaDosis = detRecetaDosis; }
    
    public String getDetRecetaDur() { return detRecetaDur; }
    public void setDetRecetaDur(String detRecetaDur) { this.detRecetaDur = detRecetaDur; }
    
    public String getDetRecetaIndicaciones() { return detRecetaIndicaciones; }
    public void setDetRecetaIndicaciones(String detRecetaIndicaciones) { this.detRecetaIndicaciones = detRecetaIndicaciones; }
    
    public Integer getRecetaId() { return recetaId; }
    public void setRecetaId(Integer recetaId) { this.recetaId = recetaId; }
    
    public Integer getMedicamentoId() { return medicamentoId; }
    public void setMedicamentoId(Integer medicamentoId) { this.medicamentoId = medicamentoId; }
    
    public String getMedicamentoNombre() { return medicamentoNombre; }
    public void setMedicamentoNombre(String medicamentoNombre) { this.medicamentoNombre = medicamentoNombre; }
    
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    
    @Override
    public String toString() {
        return "DetalleReceta{" +
                "id=" + detRecetaId +
                ", medicamento='" + detRecetaMed + '\'' +
                ", cantidad=" + detRecetaCant +
                '}';
    }
}