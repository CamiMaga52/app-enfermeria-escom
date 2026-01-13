package com.escom.enfermeria.models;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Categoria {
    private Integer categoriaId;
    private String categoriaNom;
    private String categoriaDesc;
    
    public Categoria() {}
    
    public Categoria(Integer categoriaId, String categoriaNom, String categoriaDesc) {
        this.categoriaId = categoriaId;
        this.categoriaNom = categoriaNom;
        this.categoriaDesc = categoriaDesc;
    }
    
    // Getters y Setters
    public Integer getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }
    
    public String getCategoriaNom() { return categoriaNom; }
    public void setCategoriaNom(String categoriaNom) { this.categoriaNom = categoriaNom; }
    
    public String getCategoriaDesc() { return categoriaDesc; }
    public void setCategoriaDesc(String categoriaDesc) { this.categoriaDesc = categoriaDesc; }
    
    @Override
    public String toString() {
        return "Categoria{" +
                "id=" + categoriaId +
                ", nombre='" + categoriaNom + '\'' +
                '}';
    }
}