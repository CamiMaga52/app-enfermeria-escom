package com.escom.enfermeria.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Material {
    private Integer materialId;
    private String materialNom;
    private String materialDesc;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate materialFecComp;
    
    private String materialEstado; // DISPONIBLE, AGOTADO, DESGASTADO, MANTENIMIENTO
    private Integer materialStock;
    private Integer materialStockMin;
    private BigDecimal materialPrecio;
    private Integer categoriaId;
    private String categoriaNombre; // Para mostrar el nombre de la categoría
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    
    // Constructores
    public Material() {}
    
    public Material(Integer materialId, String materialNom, String materialDesc,
                   LocalDate materialFecComp, String materialEstado,
                   Integer materialStock, Integer materialStockMin,
                   BigDecimal materialPrecio, Integer categoriaId) {
        this.materialId = materialId;
        this.materialNom = materialNom;
        this.materialDesc = materialDesc;
        this.materialFecComp = materialFecComp;
        this.materialEstado = materialEstado;
        this.materialStock = materialStock;
        this.materialStockMin = materialStockMin;
        this.materialPrecio = materialPrecio;
        this.categoriaId = categoriaId;
    }
    
    // Getters y Setters
    public Integer getMaterialId() { return materialId; }
    public void setMaterialId(Integer materialId) { this.materialId = materialId; }
    
    public String getMaterialNom() { return materialNom; }
    public void setMaterialNom(String materialNom) { this.materialNom = materialNom; }
    
    public String getMaterialDesc() { return materialDesc; }
    public void setMaterialDesc(String materialDesc) { this.materialDesc = materialDesc; }
    
    public LocalDate getMaterialFecComp() { return materialFecComp; }
    public void setMaterialFecComp(LocalDate materialFecComp) { this.materialFecComp = materialFecComp; }
    
    public String getMaterialEstado() { return materialEstado; }
    public void setMaterialEstado(String materialEstado) { this.materialEstado = materialEstado; }
    
    public Integer getMaterialStock() { return materialStock; }
    public void setMaterialStock(Integer materialStock) { this.materialStock = materialStock; }
    
    public Integer getMaterialStockMin() { return materialStockMin; }
    public void setMaterialStockMin(Integer materialStockMin) { this.materialStockMin = materialStockMin; }
    
    public BigDecimal getMaterialPrecio() { return materialPrecio; }
    public void setMaterialPrecio(BigDecimal materialPrecio) { this.materialPrecio = materialPrecio; }
    
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
        return "Material{" +
                "id=" + materialId +
                ", nombre='" + materialNom + '\'' +
                ", stock=" + materialStock +
                ", estado='" + materialEstado + '\'' +
                '}';
    }
}