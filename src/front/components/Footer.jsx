import { Link } from "react-router-dom"
import "./footer.css"
import { useNavigate } from "react-router-dom"

export const Footer = () => {
  const token = localStorage.getItem("token")

  const navigate = useNavigate()

  const handleClick = (e) => {
    if (e.target.name === "support"){
      if (token) {
        navigate("/support")
      } else {
        navigate("/login")
      }
    }
    if (e.target.name === "review"){
      if (token) {
        navigate("/review")
      } else {
        navigate("/login")
      }
    }
    if (e.target.name === "legal"){
      navigate("/legal")
    }
  }

  return (
    <footer className="footer">
      <div className="footer-links">
        <span className="footer-logo">Hogaria</span>
        <button onClick={handleClick} name="support" className="footer-buttons">Atención al cliente</button>
        <button onClick={handleClick} name="review" className="footer-buttons">Valorar servicio</button>
        <button onClick={handleClick} name="legal" className="footer-buttons">Legal</button>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} Hogaria
      </p>
    </footer>
  )

}