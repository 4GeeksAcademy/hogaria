import { Link } from "react-router-dom"
import "./footer.css"

export const Footer = () => {

  return (

    <footer className="footer">

      <div className="footer-links">

        <span className="footer-logo">Hogaria</span>

        <Link to="/support">Atención al cliente</Link>

        <Link to="/review">Valorar servicio</Link>

        <Link to="/legal">Legal</Link>

      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Hogaria
      </p>

    </footer>

  )

}