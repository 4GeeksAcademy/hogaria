import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/backendServices.js";
import "./Login.css";
import logo1 from "../assets/img/hogaria-casa.png";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const navigate = useNavigate();

  // Estados originales
  const [user, setUser] = useState({ email: "", password: "" });

  // Estados nuevos para el flujo de Google + Teléfono
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempGoogleData, setTempGoogleData] = useState(null);
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      alert("All fields are required");
      return;
    }
    login(user, navigate);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg);

      if (data.is_new) {
        // En lugar de prompt, guardamos datos y abrimos modal
        setTempGoogleData(data);
        setShowPhoneModal(true);
      } else {
        completeLogin(data);
      }
    } catch (error) {
      alert("Error en el acceso con Google");
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phone) return alert("Por favor, introduce un número de teléfono");

    try {
      // Actualizamos el teléfono en el backend antes de finalizar
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile?user_id=${tempGoogleData.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempGoogleData.access_token}`
        },
        body: JSON.stringify({ phone: phone })
      });

      if (response.ok) {
        completeLogin(tempGoogleData);
      } else {
        alert("Error al guardar el teléfono");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al guardar teléfono");
    }
  };

  const completeLogin = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_type", "user");
    localStorage.setItem("user_id", data.user_id);
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logoCasa">
          <img src={logo1} alt="Hogaria Casa" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>
          <div className="remember">
          </div>
          <button type="submit" className="login-btn">LOGIN</button>
        </form>

        <p style={{ margin: "15px 0" }}>or</p>

        <div className="googlelogin">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <p className="signup">
          New here?{" "}
          <span onClick={() => navigate("/register/")}>Register</span>
        </p>
      </div>
      {showPhoneModal && (
        <div className="modal d-block modal-overlay">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header justify-content-center border-0">
                <h5 className="modal-title fw-bold text-white">¡Bienvenido a Hogaria!</h5>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="text-muted">Para completar tu registro, por favor indícanos un número de teléfono:</p>
                <input
                  type="tel"
                  className="form-control form-control-lg text-center"
                  placeholder="Número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-footer border-0 p-3">
                <button className="btn btn-success w-100 py-2 fw-bold" onClick={handlePhoneSubmit}>
                  FINALIZAR REGISTRO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};