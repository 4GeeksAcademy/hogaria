import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Home.css";


const services = [
  {
    id: 1,
    title: "Fontanería",
    icon: "🚿",
    description: "Reparaciones, fugas y urgencias 24h."
  },
  {
    id: 2,
    title: "Electricidad",
    icon: "⚡",
    description: "Instalaciones y averías eléctricas."
  },
  {
    id: 3,
    title: "Cerrajería",
    icon: "🔑",
    description: "Apertura de puertas y cambio de cerraduras."
  },
  {
    id: 4,
    title: "Reformas",
    icon: "🧱",
    description: "Reformas integrales y parciales."
  },
  {
    id: 5,
    title: "Climatización",
    icon: "❄️",
    description: "Instalación y reparación de aire acondicionado."
  },
  {
    id: 6,
    title: "Limpieza",
    icon: "🧼",
    description: "Servicios profesionales para tu hogar."
  },
  {
    id: 7,
    title: "Mudanzas",
    icon: "🧼",
    description: "Servicios de mudanzas o traslados."
  },
  {
    id: 8,
    title: "Pintura",
    icon: "🧼",
    description: "Pintamos tu hogar o tu empresa."
  }
];

export const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Servicios para tu hogar o empresa!
      </h1>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button className="service-btn">
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};