import { useState } from "react"
import "./Login.css"
import { signup } from "../Services/backendServices.js";
import { useNavigate } from "react-router-dom";

export const RegisterUser = () => {

  const navigate = useNavigate()

  const [user,setUser] = useState({
    name:"",
    lastname:"",
    email:"",
    password:"",
    phone:""
  })

  const handleChange = (e) => {
    setUser({
        ...user,
        [e.target.name]:e.target.value
    })
  }

  const handleClick = (e)=>{
    e.preventDefault()
    if (!user.email || !user.password || !user.name || !user.lastname || !user.phone) {
        alert("All fields are required")
        return
    }
    console.log(user)
    signup(user, navigate)
  }

  return(

    <div className="login-container">

      <div className="login-card">

        <h2>Registro Usuario</h2>

        <form>

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
              type="text"
              placeholder="Teléfono"
              onChange={handleChange}
              name="phone"
            />
          </div>

          <button type="submit" className="login-btn" onClick={handleClick} >
            Crear cuenta
          </button>

        </form>

      </div>

    </div>

  )
}