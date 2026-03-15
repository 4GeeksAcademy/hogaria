import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import logo from "../assets/img/hogaria-logo.png";

export const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/home">
            <img src={logo} alt="Hogaria Logo" />
          </Link>
        </div>

        <div className="d-flex align-items-center ms-auto gap-3">
          <div className="nav-auth">
            {!token ? (
              <>
                <Link to="/login" className="login-link">Iniciar sesión</Link>
                <Link to="/register" className="register-btn">Registrarse</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            )}
          </div>
          <form className="d-flex" onSubmit={handleSubmit} style={{ minWidth: 220 }}>
            <input
              className="form-control me-3"
              type="search"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="register-btn" type="submit">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

};