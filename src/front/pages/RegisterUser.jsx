import { useState } from "react"
import "./Login.css"
import { login, signup } from "../services/backendServices.js";
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

  const handleSubmit = (e)=>{
    e.preventDefault()
    console.log(user)
  }
  const handleClick = (e)=>{
    e.preventDefault()
    if (!user.email || !user.password){
        alert("All fields are required")
        return
    }
    signup(user, navigate)

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
              onChange={(e)=>setUser({...user,name:e.target.value})}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Apellido"
              onChange={(e)=>setUser({...user,lastname:e.target.value})}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo"
              onChange={(e)=>setUser({...user,email:e.target.value})}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e)=>setUser({...user,password:e.target.value})}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Teléfono (opcional)"
              onChange={(e)=>setUser({...user,phone:e.target.value})}
            />
          </div>

          <button className="login-btn" onClick={handleClick}>
            Crear cuenta
          </button>

        </form>

      </div>

    </div>

  )
}