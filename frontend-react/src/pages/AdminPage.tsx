"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import ConfirmModal from "../components/UI/ConfirmModal"
import "./AdminPage.css"

const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [activeTab, setActiveTab] = useState<"pacientes" | "usuarios">("pacientes")

  // Estados para Pacientes
  const [pacientes, setPacientes] = useState<any[]>([])
  const [showPacienteModal, setShowPacienteModal] = useState(false)
  const [editingPaciente, setEditingPaciente] = useState<any>(null)
  const [pacienteForm, setPacienteForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    genero: "",
    telefono: "",
    direccion: "",
    alergias: "",
  })

  // Estados para Usuarios
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [showUsuarioModal, setShowUsuarioModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<any>(null)
  const [usuarioForm, setUsuarioForm] = useState({
    username: "",
    password: "",
    email: "",
    rol: "ENFERMERA",
    nombre: "",
    apellido: "",
  })

  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmTitle, setConfirmTitle] = useState("")

  if (!user) {
    navigate("/login")
    return null
  }

  if (!authService.isAdmin()) {
    navigate("/dashboard")
    return null
  }

  // Funciones CRUD PACIENTES
  // Aquí conectas con tu API de Spring Boot

  const handleCreatePaciente = () => {
    setEditingPaciente(null)
    setPacienteForm({
      nombre: "",
      apellido: "",
      edad: "",
      genero: "",
      telefono: "",
      direccion: "",
      alergias: "",
    })
    setShowPacienteModal(true)
  }

  const handleEditPaciente = (paciente: any) => {
    setEditingPaciente(paciente)
    setPacienteForm({ ...paciente })
    setShowPacienteModal(true)
  }

  const handleSavePaciente = async () => {
    // TODO: Conectar con tu API
    // if (editingPaciente) {
    //   await fetch(`http://localhost:8080/api/pacientes/${editingPaciente.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(pacienteForm)
    //   })
    // } else {
    //   await fetch('http://localhost:8080/api/pacientes', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(pacienteForm)
    //   })
    // }

    console.log("Guardar paciente:", pacienteForm)
    setShowPacienteModal(false)
    // Aquí recargas la lista de pacientes
  }

  const handleDeletePaciente = async (id: number) => {
    setConfirmTitle("Eliminar Paciente")
    setConfirmMessage("¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.")
    setConfirmAction(() => async () => {
      // TODO: Conectar con tu API
      console.log("Eliminar paciente:", id)
      setShowConfirmModal(false)
      // Aquí recargas la lista de pacientes
    })
    setShowConfirmModal(true)
  }

  // Funciones CRUD USUARIOS
  // Aquí conectas con tu API de Spring Boot

  const handleCreateUsuario = () => {
    setEditingUsuario(null)
    setUsuarioForm({
      username: "",
      password: "",
      email: "",
      rol: "ENFERMERA",
      nombre: "",
      apellido: "",
    })
    setShowUsuarioModal(true)
  }

  const handleEditUsuario = (usuario: any) => {
    setEditingUsuario(usuario)
    setUsuarioForm({ ...usuario, password: "" })
    setShowUsuarioModal(true)
  }

  const handleSaveUsuario = async () => {
    // TODO: Conectar con tu API
    // if (editingUsuario) {
    //   await fetch(`http://localhost:8080/api/usuarios/${editingUsuario.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(usuarioForm)
    //   })
    // } else {
    //   await fetch('http://localhost:8080/api/usuarios', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(usuarioForm)
    //   })
    // }

    console.log("Guardar usuario:", usuarioForm)
    setShowUsuarioModal(false)
    // Aquí recargas la lista de usuarios
  }

  const handleDeleteUsuario = async (id: number) => {
    setConfirmTitle("Eliminar Usuario")
    setConfirmMessage("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")
    setConfirmAction(() => async () => {
      // TODO: Conectar con tu API
      console.log("Eliminar usuario:", id)
      setShowConfirmModal(false)
      // Aquí recargas la lista de usuarios
    })
    setShowConfirmModal(true)
  }

  return (
    <div className="admin-page">
      <Header isAdmin={true} />

      <main className="admin-main">
        <div className="container">
          <div className="page-header mb-4">
            <h2 className="h3">Panel de Administración</h2>
            <p className="text-muted">Gestión de pacientes y usuarios del sistema</p>
          </div>

          {/* Pestañas */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "pacientes" ? "active" : ""}`}
                onClick={() => setActiveTab("pacientes")}
              >
                <i className="bi bi-people me-2"></i>
                Pacientes
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "usuarios" ? "active" : ""}`}
                onClick={() => setActiveTab("usuarios")}
              >
                <i className="bi bi-person-badge me-2"></i>
                Usuarios Registrados
              </button>
            </li>
          </ul>

          {/* Contenido de Pacientes */}
          {activeTab === "pacientes" && (
            <div className="tab-content">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Lista de Pacientes</h4>
                <button className="btn btn-primary" onClick={handleCreatePaciente}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Paciente
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Edad</th>
                      <th>Género</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">
                          No hay pacientes registrados. Haz clic en "Nuevo Paciente" para agregar uno.
                        </td>
                      </tr>
                    ) : (
                      pacientes.map((paciente) => (
                        <tr key={paciente.id}>
                          <td>{paciente.id}</td>
                          <td>{paciente.nombre}</td>
                          <td>{paciente.apellido}</td>
                          <td>{paciente.edad}</td>
                          <td>{paciente.genero}</td>
                          <td>{paciente.telefono}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditPaciente(paciente)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeletePaciente(paciente.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contenido de Usuarios */}
          {activeTab === "usuarios" && (
            <div className="tab-content">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Lista de Usuarios</h4>
                <button className="btn btn-primary" onClick={handleCreateUsuario}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Usuario
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          No hay usuarios registrados. Haz clic en "Nuevo Usuario" para agregar uno.
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>{usuario.username}</td>
                          <td>
                            {usuario.nombre} {usuario.apellido}
                          </td>
                          <td>{usuario.email}</td>
                          <td>
                            <span className={`badge bg-${usuario.rol === "ADMIN" ? "danger" : "info"}`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditUsuario(usuario)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUsuario(usuario.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Paciente */}
      {showPacienteModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: "white" }}>
              <div className="modal-header">
                <h5 className="modal-title">{editingPaciente ? "Editar Paciente" : "Nuevo Paciente"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowPacienteModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={pacienteForm.nombre}
                        onChange={(e) => setPacienteForm({ ...pacienteForm, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={pacienteForm.apellido}
                        onChange={(e) => setPacienteForm({ ...pacienteForm, apellido: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                        Edad
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={pacienteForm.edad}
                        onChange={(e) => setPacienteForm({ ...pacienteForm, edad: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                        Género
                      </label>
                      <select
                        className="form-select"
                        value={pacienteForm.genero}
                        onChange={(e) => setPacienteForm({ ...pacienteForm, genero: e.target.value })}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={pacienteForm.telefono}
                      onChange={(e) => setPacienteForm({ ...pacienteForm, telefono: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={pacienteForm.direccion}
                      onChange={(e) => setPacienteForm({ ...pacienteForm, direccion: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                      Alergias
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={pacienteForm.alergias}
                      onChange={(e) => setPacienteForm({ ...pacienteForm, alergias: e.target.value })}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPacienteModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSavePaciente}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Usuario */}
      {showUsuarioModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: "white" }}>
              <div className="modal-header">
                <h5 className="modal-title">{editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowUsuarioModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={usuarioForm.nombre}
                        onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={usuarioForm.apellido}
                        onChange={(e) => setUsuarioForm({ ...usuarioForm, apellido: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={usuarioForm.username}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, username: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {editingUsuario ? "Nueva Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={usuarioForm.password}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, password: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={usuarioForm.email}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#333", fontWeight: "500" }}>
                      Rol
                    </label>
                    <select
                      className="form-select"
                      value={usuarioForm.rol}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, rol: e.target.value })}
                    >
                      <option value="ENFERMERA">Enfermera</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUsuarioModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveUsuario}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        show={showConfirmModal}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Backdrop para modales */}
      {(showPacienteModal || showUsuarioModal) && <div className="modal-backdrop show"></div>}

      <Footer />
    </div>
  )
}

export default AdminPage
