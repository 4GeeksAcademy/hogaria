import { useState } from "react"
import "./Login.css"
import { signupCompany } from "../Services/backendServices.js";
import { useNavigate } from "react-router-dom";

export const RegisterCompany = () => {

  const navigate = useNavigate()

  const [company,setCompany] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
    phone:""
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    if (!company.email || !company.password || !company.name || !company.confirmPassword || !company.phone) {
        alert("All fields are required")
        return
    }else if (company.password !== company.confirmPassword) {
        alert("Passwords do not match")
        return
    }
    signupCompany(company, navigate)
  }
  const handleChange = (e) => {
    setCompany({
        ...company,
        [e.target.name]:e.target.value
    })
  }

  return(

    <div className="login-container">

      <div className="login-card">

        <h2>Registro Empresa</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre de empresa"
              onChange={handleChange}
              name="name"
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo"
              onChange={handleChange}
              name="email"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              name="password"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              onChange={handleChange}
              name="confirmPassword"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Teléfono"
              onChange={handleChange}
              name="phone"
            />
          </div>

          <button className="login-btn" type="submit">
            Crear cuenta
          </button>

        </form>

      </div>

    </div>

  )
}