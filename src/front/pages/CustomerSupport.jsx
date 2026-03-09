import { useState } from "react"
import "./support.css"

export const CustomerSupport = () => {

  const [form,setForm] = useState({
    name:"",
    email:"",
    message:""
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    console.log(form)
  }

  return(

    <div className="support-container">

      <h1>Atención al Cliente</h1>

      <p className="support-text">
        Si tienes algún problema con un servicio o necesitas ayuda,
        puedes contactarnos usando el formulario.
      </p>

      <div className="support-info">

        <div className="support-card">
          <h3>Email</h3>
          <p>soporte@hogaria.com</p>
        </div>

        <div className="support-card">
          <h3>Teléfono</h3>
          <p>+34 600 000 000</p>
        </div>

        <div className="support-card">
          <h3>Horario</h3>
          <p>Lunes a Viernes 9:00 - 18:00</p>
        </div>

      </div>

      <form className="support-form" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Nombre"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          type="email"
          placeholder="Correo"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <textarea
          placeholder="Describe tu problema"
          rows="4"
          onChange={(e)=>setForm({...form,message:e.target.value})}
        />

        <button>Enviar mensaje</button>

      </form>

    </div>

  )
}