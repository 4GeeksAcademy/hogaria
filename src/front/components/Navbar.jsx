import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import logo from "../assets/img/hogaria-logo.png";

export const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type"); // "user" o "company"
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    navigate("/login");
  };

  // Determinar las rutas según el tipo de usuario
  const profileRoute = userType === "company" ? "/profile/company" : "/profile";
  const bookingsRoute = userType === "company" ? "/profile/company?tab=requests" : "/profile?tab=bookings";
  const bookingsLabel = userType === "company" ? "📬 Solicitudes" : "📅 Reservas";
  const settingsRoute = userType === "company" ? "/profile/company?tab=settings" : "/profile?tab=settings";

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
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
            ) : null}
            
            {/* DROPDOWN - Siempre visible para prueba */}
            <div className="navbar-dropdown">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                <span>☰</span>
                <span>Mi Cuenta</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  {/* PERFIL */}
                  <Link
                    to={profileRoute}
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 Perfil
                  </Link>

                  <div className="dropdown-divider"></div>

                  {/* RESERVAS / SOLICITUDES */}
                  {token && (
                    <>
                      <Link
                        to={bookingsRoute}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {bookingsLabel}
                      </Link>
                      <div className="dropdown-divider"></div>
                    </>
                  )}

                  {/* AJUSTES */}
                  <Link
                    to={settingsRoute}
                    onClick={() => setDropdownOpen(false)}
                  >
                    ⚙️ Ajustes
                  </Link>

                  <div className="dropdown-divider"></div>

                  {/* LOGOUT */}
                  {token ? (
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 15px",
                        color: "#ef4444",
                        textDecoration: "none"
                      }}
                    >
                      🚪 Cerrar sesión
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        color: "#1e3a8a"
                      }}
                    >
                      🔐 Inicia sesión
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          {token && (
            <form className="d-flex" onSubmit={handleSubmit} style={{ minWidth: 220 }}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="register-btn" type="submit">
                Buscar
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};