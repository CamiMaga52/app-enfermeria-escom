package com.escom.enfermeria.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Medicamento {
    private Integer medicamentoId;
    private String medicamentoNom;
    private String medicamentoDesc;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate medicamentoFecComp;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate medicamentoFecCad;
    
    private String medicamentoLote;
    private String medicamentoLaboratorio;
    private String medicamentoEstado; // DISPONIBLE, AGOTADO, CADUCADO, RESERVADO
    private Integer medicamentoStock;
    private Integer medicamentoStockMin;
    private BigDecimal medicamentoPrecio;
    private Integer categoriaId;
    private String categoriaNombre; // Para mostrar el nombre de la categoría
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    
    // Constructores
    public Medicamento() {}
    
    public Medicamento(Integer medicamentoId, String medicamentoNom, String medicamentoDesc,
                      LocalDate medicamentoFecComp, LocalDate medicamentoFecCad,
                      String medicamentoLote, String medicamentoLaboratorio,
                      String medicamentoEstado, Integer medicamentoStock,
                      Integer medicamentoStockMin, BigDecimal medicamentoPrecio,
                      Integer categoriaId) {
        this.medicamentoId = medicamentoId;
        this.medicamentoNom = medicamentoNom;
        this.medicamentoDesc = medicamentoDesc;
        this.medicamentoFecComp = medicamentoFecComp;
        this.medicamentoFecCad = medicamentoFecCad;
        this.medicamentoLote = medicamentoLote;
        this.medicamentoLaboratorio = medicamentoLaboratorio;
        this.medicamentoEstado = medicamentoEstado;
        this.medicamentoStock = medicamentoStock;
        this.medicamentoStockMin = medicamentoStockMin;
        this.medicamentoPrecio = medicamentoPrecio;
        this.categoriaId = categoriaId;
    }
    
    // Getters y Setters
    public Integer getMedicamentoId() { return medicamentoId; }
    public void setMedicamentoId(Integer medicamentoId) { this.medicamentoId = medicamentoId; }
    
    public String getMedicamentoNom() { return medicamentoNom; }
    public void setMedicamentoNom(String medicamentoNom) { this.medicamentoNom = medicamentoNom; }
    
    public String getMedicamentoDesc() { return medicamentoDesc; }
    public void setMedicamentoDesc(String medicamentoDesc) { this.medicamentoDesc = medicamentoDesc; }
    
    public LocalDate getMedicamentoFecComp() { return medicamentoFecComp; }
    public void setMedicamentoFecComp(LocalDate medicamentoFecComp) { this.medicamentoFecComp = medicamentoFecComp; }
    
    public LocalDate getMedicamentoFecCad() { return medicamentoFecCad; }
    public void setMedicamentoFecCad(LocalDate medicamentoFecCad) { this.medicamentoFecCad = medicamentoFecCad; }
    
    public String getMedicamentoLote() { return medicamentoLote; }
    public void setMedicamentoLote(String medicamentoLote) { this.medicamentoLote = medicamentoLote; }
    
    public String getMedicamentoLaboratorio() { return medicamentoLaboratorio; }
    public void setMedicamentoLaboratorio(String medicamentoLaboratorio) { this.medicamentoLaboratorio = medicamentoLaboratorio; }
    
    public String getMedicamentoEstado() { return medicamentoEstado; }
    public void setMedicamentoEstado(String medicamentoEstado) { this.medicamentoEstado = medicamentoEstado; }
    
    public Integer getMedicamentoStock() { return medicamentoStock; }
    public void setMedicamentoStock(Integer medicamentoStock) { this.medicamentoStock = medicamentoStock; }
    
    public Integer getMedicamentoStockMin() { return medicamentoStockMin; }
    public void setMedicamentoStockMin(Integer medicamentoStockMin) { this.medicamentoStockMin = medicamentoStockMin; }
    
    public BigDecimal getMedicamentoPrecio() { return medicamentoPrecio; }
    public void setMedicamentoPrecio(BigDecimal medicamentoPrecio) { this.medicamentoPrecio = medicamentoPrecio; }
    
    public Integer getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }
    
    public String getCategoriaNombre() { return categoriaNombre; }
    public void setCategoriaNombre(String categoriaNombre) { this.categoriaNombre = categoriaNombre; }
    
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    
    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }
    
    @Override
    public String toString() {
        return "Medicamento{" +
                "id=" + medicamentoId +
                ", nombre='" + medicamentoNom + '\'' +
                ", stock=" + medicamentoStock +
                ", estado='" + medicamentoEstado + '\'' +
                '}';
    }
}