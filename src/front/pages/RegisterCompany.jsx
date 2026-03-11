import { useState } from "react"
import "./Login.css"

export const RegisterCompany = () => {

  const [company,setCompany] = useState({
    name:"",
    email:"",
    password:""
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    console.log(company)
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
              onChange={(e)=>setCompany({...company,name:e.target.value})}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo"
              onChange={(e)=>setCompany({...company,email:e.target.value})}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e)=>setCompany({...company,password:e.target.value})}
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