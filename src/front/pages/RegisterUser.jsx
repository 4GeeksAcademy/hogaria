import { useState } from "react"
import "./Login.css"

export const RegisterUser = () => {

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

          <button className="login-btn">
            Crear cuenta
          </button>

        </form>

      </div>

    </div>

  )
}