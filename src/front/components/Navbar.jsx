import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/img/hogaria-logo.png";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

<<<<<<< HEAD
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto d-flex gap-2">
					<Link to="/search">
						<button className="btn btn-success">Buscar Profesionales</button>
					</Link>
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
=======
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">

        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Hogaria Logo" />
          </Link>
        </div>

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

      </div>
    </nav>
  );
>>>>>>> develop
};