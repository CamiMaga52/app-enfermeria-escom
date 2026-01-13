package com.escom.enfermeria.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class Paciente {
    private Integer pacienteId;
    private String pacienteNombre;
    private String pacienteEscuela;
    private Integer pacienteEdad;
    private String pacienteTelefono;
    private String pacienteEmail;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime created_at;
    
    // Constructores
    public Paciente() {}
    
    public Paciente(Integer pacienteId, String pacienteNombre, String pacienteEscuela,
                   Integer pacienteEdad, String pacienteTelefono, String pacienteEmail) {
        this.pacienteId = pacienteId;
        this.pacienteNombre = pacienteNombre;
        this.pacienteEscuela = pacienteEscuela;
        this.pacienteEdad = pacienteEdad;
        this.pacienteTelefono = pacienteTelefono;
        this.pacienteEmail = pacienteEmail;
    }
    
    // Getters y Setters
    public Integer getPacienteId() { return pacienteId; }
    public void setPacienteId(Integer pacienteId) { this.pacienteId = pacienteId; }
    
    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }
    
    public String getPacienteEscuela() { return pacienteEscuela; }
    public void setPacienteEscuela(String pacienteEscuela) { this.pacienteEscuela = pacienteEscuela; }
    
    public Integer getPacienteEdad() { return pacienteEdad; }
    public void setPacienteEdad(Integer pacienteEdad) { this.pacienteEdad = pacienteEdad; }
    
    public String getPacienteTelefono() { return pacienteTelefono; }
    public void setPacienteTelefono(String pacienteTelefono) { this.pacienteTelefono = pacienteTelefono; }
    
    public String getPacienteEmail() { return pacienteEmail; }
    public void setPacienteEmail(String pacienteEmail) { this.pacienteEmail = pacienteEmail; }
    
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    
    @Override
    public String toString() {
        return "Paciente{" +
                "id=" + pacienteId +
                ", nombre='" + pacienteNombre + '\'' +
                ", escuela='" + pacienteEscuela + '\'' +
                ", edad=" + pacienteEdad +
                '}';
    }
}