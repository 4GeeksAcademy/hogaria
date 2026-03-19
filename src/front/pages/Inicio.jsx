import "./Inicio.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/hogaria-casa.png";
import fontaneria from "../assets/img/fontaneria.png";
import electricidad from "../assets/img/electricidad.png";
import cerrajeria from "../assets/img/cerrajeria.png";
import reformas from "../assets/img/reformas.png";
import climatizacion from "../assets/img/climatizacion.png";
import limpieza from "../assets/img/limpieza.png";
import mudanza from "../assets/img/mudanza.png";
import pintura from "../assets/img/pintura.png";

const services = [
  { icon: <div className="fontaneria"><img src={fontaneria} alt="Fontanería" /></div>, },
  { icon: <div className="electricidad"><img src={electricidad} alt="Electricidad" /></div>, },
  { icon: <div className="cerrajeria"><img src={cerrajeria} alt="Cerrajería" /></div>, },
  { icon: <div className="reformas"><img src={reformas} alt="Reformas" /></div>, },
  { icon: <div className="climatizacion"><img src={climatizacion} alt="Climatización" /></div>, },
  { icon: <div className="limpieza"><img src={limpieza} alt="Limpieza" /></div>, },
  { icon: <div className="mudanza"><img src={mudanza} alt="Mudanzas" /></div>, },
  { icon: <div className="pintura"><img src={pintura} alt="Pintura" /></div>, },
];

export const Inicio = () => {

  const navigate = useNavigate();

  return (

    <div className="inicio-page">
      <div className="inicio-title">
        <h1>¡Bienvenido a Hogaria!</h1>
      </div>
      <div className="orbit-wrapper">

        {/* LOGO */}
        <div
          className="center-logo"
          onClick={() => navigate("/Home")}
        >
          <img src={logo} alt="Hogaria" />
        </div>

        {/* SERVICIOS */}
        <div className="orbit">

          {services.map((s, i) => (

            <div
              key={i}
              className="orbit-item"
              style={{ "--i": i }}
              onClick={() => navigate("/Home")}
            >

              <div className="orbit-card">
                <span className="icon">{s.icon}</span>
                <span className="label">{s.name}</span>
              </div>

            </div>

          ))}

        </div>

      </div>

      <p className="inicio-subtitle">Tu plataforma de servicios para el hogar o empresa</p>
    </div>

  )
}