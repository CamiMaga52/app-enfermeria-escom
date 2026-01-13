import api from "./api"
import type { LoginRequest } from "../models/LoginRequest"

export interface User {
  usuario_id: number
  usuario_nombre: string
  usuario_correo: string
  rol_id: number
  rol_nombre: string
  nombre?: string // Para compatibilidad
  rol?: string // Para compatibilidad
  usuario_activo: boolean
  token?: string
}

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      // Intenta primero el endpoint login-dev, si falla intenta /auth/login
      let response
      try {
        response = await api.post("/auth/login-dev", credentials)
      } catch (devError) {
        console.log("login-dev failed, trying /auth/login")
        response = await api.post("/auth/login", credentials)
      }

      if (response.data.success) {
        const userData = response.data.user || response.data.usuario
        const token = response.data.token || "fake-jwt-token"

        // Asegurar compatibilidad con DashboardPage
        const user: User = {
          ...userData,
          nombre: userData.usuario_nombre || userData.nombre,
          rol: userData.rol_nombre || userData.rol || "USER",
          token: token,
        }

        localStorage.setItem("user_data", JSON.stringify(user))
        localStorage.setItem("auth_token", token)
      }

      return response.data
    } catch (error: any) {
      // Manejo de errores específicos
      if (error.response?.status === 401) {
        throw new Error("Credenciales incorrectas")
      }
      if (error.response?.status === 404) {
        throw new Error("Endpoint de autenticación no encontrado")
      }
      throw error
    }
  },

  logout() {
    localStorage.removeItem("user_data")
    localStorage.removeItem("auth_token")
    window.location.href = "/login"
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user_data")
      if (!userStr) return null

      const user = JSON.parse(userStr)

      // Asegurar que tenga los campos que DashboardPage espera
      return {
        ...user,
        nombre: user.nombre || user.usuario_nombre || "Usuario",
        rol: user.rol || user.rol_nombre || "USER",
        correo: user.correo || user.usuario_correo,
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  },

  isAuthenticated(): boolean {
    const user = this.getCurrentUser()
    return !!user && !!localStorage.getItem("auth_token")
  },

  async checkApiHealth() {
    try {
      // Intentar diferentes endpoints de salud
      const endpoints = [
        "http://localhost:8080/api/auth/health",
        "http://localhost:8080/api/health",
        "http://localhost:8080/actuator/health",
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })

          if (response.ok) {
            const data = await response.json()
            return {
              ...data,
              endpoint: endpoint,
            }
          }
        } catch (e) {
          continue // Intentar siguiente endpoint
        }
      }

      // Si ninguno funcionó
      throw new Error("No se pudo conectar al backend")
    } catch (error: any) {
      console.error("Error checkApiHealth:", error)
      return {
        success: false,
        database: "DISCONNECTED",
        mensaje: "Backend no disponible",
        totalUsuarios: 0,
      }
    }
  },

  // Método para verificar si el usuario es admin
  isAdmin(): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const userRole = (user.rol || user.rol_nombre || "").toUpperCase()
    return userRole === "ADMIN" || userRole === "ADMINISTRADOR"
  },

  // Método para verificar si el usuario tiene un rol específico
  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const userRole = user.rol || user.rol_nombre || ""
    return userRole.toUpperCase() === roleName.toUpperCase()
  },
}
