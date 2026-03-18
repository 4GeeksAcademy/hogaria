import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom"
import "./Home.css";
import fontaneria from "../assets/img/fontaneria.png";
import electricidad from "../assets/img/electricidad.png";
import cerrajeria from "../assets/img/cerrajeria.png";
import reformas from "../assets/img/reformas.png";
import climatizacion from "../assets/img/climatizacion.png";
import limpieza from "../assets/img/limpieza.png";
import mudanza from "../assets/img/mudanza.png";
import pintura from "../assets/img/pintura.png";
import comercios from "../assets/img/comercios.png";
import atencion from "../assets/img/atencion.png";
import valoracion from "../assets/img/valoracion.png";



const services = [

  {
    id: 1,
    title: "Fontanería",
    icon: <div className="fontaneria"><img src={fontaneria} alt="Fontanería" /></div>,
    description: "Reparaciones, fugas y urgencias 24h."
  },
  {
    id: 2,
    title: "Electricidad",
    icon: <div className="electricidad"><img src={electricidad} alt="Electricidad" /></div>,
    description: "Instalaciones y averías eléctricas."
  },
  {
    id: 3,
    title: "Cerrajería",
    icon: <div className="cerrajeria"><img src={cerrajeria} alt="Cerrajería" /></div>,
    description: "Apertura de puertas y cambio de cerraduras."
  },
  {
    id: 4,
    title: "Reformas",
    icon: <div className="reformas"><img src={reformas} alt="Reformas" /></div>,
    description: "Reformas integrales y parciales."
  },
  {
    id: 5,
    title: "Climatización",
    icon: <div className="climatizacion"><img src={climatizacion} alt="Climatización" /></div>,
    description: "Instalación y reparación de aire acondicionado."
  },
  {
    id: 6,
    title: "Limpieza",
    icon: <div className="limpieza"><img src={limpieza} alt="Limpieza" /></div>,
    description: "Servicios profesionales para tu hogar."
  },
  {
    id: 7,
    title: "Mudanzas",
    icon: <div className="mudanza"><img src={mudanza} alt="Mudanzas" /></div>,
    description: "Servicios de mudanzas o traslados."
  },
  {
    id: 8,
    title: "Pintura",
    icon: <div className="pintura"><img src={pintura} alt="Pintura" /></div>,
    description: "Pintamos tu hogar o tu empresa."
  },
  {
    id: 9,
    title: "Comercios",
    icon: <div className="comercios"><img src={comercios} alt="Comercios" /></div>,
    description: "Comercios en tu ubicacion"
  }
];

export const Home = () => {
  const navigate = useNavigate()
  return (

    <div className="Home-Principal">
      <div className="home-container">
        <h1 className="home-title">
          Servicios para tu hogar o empresa!
        </h1>

        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.title === "Comercios" ? "commerce-card" : ""
                }`}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button
                className="service-btn"
                onClick={() => navigate(`/services/${service.title.toLowerCase()}`)}
              >
                Ver más
              </button>
            </div>
          ))}
        </div>
        <div className="home-extra">
          <div
            className="extra-card"
            onClick={() => navigate("/support")}
          >
            <div className="Atencion"><img src={atencion} alt="Atención al Cliente" /></div>
            <h3>Atención al Cliente</h3>
          </div>

          <div
            className="extra-card"
            onClick={() => navigate("/review")}
          >
            <div className="valoracion"><img src={valoracion} alt="Valorar Servicio" /></div>
            <h3>Valorar Servicio</h3>
          </div>
        </div>
      </div>
    </div>
  );
};