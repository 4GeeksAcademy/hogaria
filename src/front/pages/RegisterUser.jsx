import { useState } from "react"
import "./Login.css"
import { signupUser } from "../Services/backendServices.js";
import { useNavigate } from "react-router-dom";

export const RegisterUser = () => {

  const navigate = useNavigate()

  const [user,setUser] = useState({
    name:"",
    lastname:"",
    email:"",
    password:"",
    confirmPassword:"",
    phone:""
  })

  const handleChange = (e) => {
    setUser({
        ...user,
        [e.target.name]:e.target.value
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    if (!user.email || !user.password || !user.name || !user.lastname || !user.phone) {
        alert("All fields are required")
        return
    }else if (user.password !== user.confirmPassword) {
        alert("Passwords do not match")
        return
    }
    signupUser(user, navigate)
  }

  return(

    <div className="login-container">

      <div className="login-card">

        <h2>Registro Usuario</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre"
              onChange={handleChange}
              name="name"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Apellido"
              onChange={handleChange}
              name="lastname"
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
              placeholder="Confirmar Contraseña"
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

          <button type="submit" className="login-btn">
            Crear cuenta
          </button>

        </form>

      </div>

    </div>

  )
}