import { useState } from "react"
import "./review.css"

export const Review = () => {

  const [review, setReview] = useState({
    company: "",
    service: "",
    rating: "",
    comment: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(review)
  }

  return (

    <div className="review-container">

      <h1>Valorar servicio</h1>
      <p>Tu opinión nos ayuda a mejorar Hogaria</p>

      <form className="review-form" onSubmit={handleSubmit}>

       
        <label>Empresa</label>
        <select
          value={review.company}
          onChange={(e) =>
            setReview({ ...review, company: e.target.value })
          }
        >
          <option value="">Selecciona una empresa</option>
          <option value="empresa1">Fontaneria Canarias</option>
          <option value="empresa2">Electricidad Canarias</option>
          <option value="empresa3">Cerrajería Canarias</option>
        </select>

       
        <label>Servicio</label>
        <select
          value={review.service}
          onChange={(e) =>
            setReview({ ...review, service: e.target.value })
          }
        >
          <option value="">Selecciona un servicio</option>
          <option value="fontaneria">Fontanería</option>
          <option value="electricidad">Electricidad</option>
          <option value="cerrajeria">Cerrajería</option>
          <option value="reformas">Reformas</option>
          <option value="limpieza">Limpieza</option>
        </select>

        
        <label>Puntuación</label>
        <select
          value={review.rating}
          onChange={(e) =>
            setReview({ ...review, rating: e.target.value })
          }
        >
          <option value="">Selecciona</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>

        
        <label>Comentario</label>
        <textarea
          rows="4"
          placeholder="Cuéntanos tu experiencia"
          value={review.comment}
          onChange={(e) =>
            setReview({ ...review, comment: e.target.value })
          }
        />

        <button>Enviar valoración</button>

      </form>

    </div>

  )
}