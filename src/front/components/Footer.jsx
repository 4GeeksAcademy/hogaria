import "./footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3>Hogaria</h3>
          <p>
            Profesionales de confianza para tu hogar. 
            Rápido, seguro y garantizado.
          </p>
        </div>

        <div className="footer-column">
          <h4>Servicios</h4>
          <ul>
            <li>Fontanería</li>
            <li>Electricidad</li>
            <li>Cerrajería</li>
            <li>Reformas</li>
            <li>Limpieza</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Empresa</h4>
          <ul>
            <li>Sobre nosotros</li>
            <li>Cómo funciona</li>
            <li>Trabaja con nosotros</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li>Política de privacidad</li>
            <li>Términos y condiciones</li>
            <li>Aviso legal</li>
            <li>Cookies</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Hogaria. Todos los derechos reservados.
      </div>
    </footer>
  );
};