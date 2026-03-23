import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./navbar.css";
import logo from "../assets/img/hogaria-logo.png";

export const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type");
  const token = localStorage.getItem("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="container d-flex align-items-center justify-content-between">
        
        <div className="logo">
          {userType === "company" ? (
            <img src={logo} alt="Hogaria Logo" style={{ cursor: "default" }} />
          ) : (
            <Link to="/">
              <img src={logo} alt="Hogaria Logo" />
            </Link>
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          
          {!token && (
            <div className="nav-auth">
              <Link to="/login" className="login-link">Iniciar sesión</Link>
              <Link to="/register" className="register-btn">Registrarse</Link>
            </div>
          )}

          {token && userType === "user" && (
            <>
              <form className="d-flex" onSubmit={handleSubmit} style={{ minWidth: 220 }}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="register-btn" type="submit">Buscar</button>
              </form>

              <div className="navbar-dropdown" ref={dropdownRef}>
                <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span>☰ Mi Cuenta</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu shadow">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>👤 Perfil</Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile?tab=bookings" onClick={() => setDropdownOpen(false)}>📅 Reservas</Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile?tab=settings" onClick={() => setDropdownOpen(false)}>⚙️ Ajustes</Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item text-danger fw-bold" 
                      onClick={handleLogout} 
                      style={{ textAlign: "left", width: "100%", border: "none", background: "none", padding: "10px 15px" }}
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {token && userType === "company" && (
            <button 
              className="btn btn-danger fw-bold px-4 shadow-sm" 
              onClick={handleLogout}
              style={{ borderRadius: "8px" }}
            >
              Cerrar Sesión
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};