import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/backendServices";
import "./Login.css";
import logo1 from "../assets/img/hogaria-casa.png";

export const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(user);

      localStorage.setItem("token", data.access_token);

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
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
              placeholder="Username"
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
          New here? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
};