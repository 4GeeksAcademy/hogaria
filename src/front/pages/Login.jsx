import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/backendServices.js";
import "./Login.css";
import logo1 from "../assets/img/hogaria-casa.png";

export const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
      e.preventDefault()
      if (!user.email || !user.password){
          alert("All fields are required")
          return
      }
      login(user, navigate)
  }

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
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
              required
            />
          </div>

          <div className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </div>

          <button type="submit" className="login-btn">
            LOGIN
          </button>

          <p className="forgot">Forgot your password?</p>
        </form>

        <p className="signup">
          New here? <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};