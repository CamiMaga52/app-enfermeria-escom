package com.escom.enfermeria.models;

public class LoginRequest {
    private String correo;
    private String password;
    
    // Constructor vacío necesario para JSON
    public LoginRequest() {}
    
    public LoginRequest(String correo, String password) {
        this.correo = correo;
        this.password = password;
    }
    
    // Getters y Setters
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    @Override
    public String toString() {
        return String.format(
            "LoginRequest{correo='%s', password='[PROTECTED]'}",
            correo
        );
    }
}