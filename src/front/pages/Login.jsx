import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/backendServices.js";
import "./Login.css";
import logo1 from "../assets/img/hogaria-casa.png";
import { GoogleLogin } from "@react-oauth/google";

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(user);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_id", data.user.id);

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: credentialResponse.credential
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Google login failed");
      }

      localStorage.setItem("token", data.access_token);

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Google login error");
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

        </form>

        <p style={{ margin: "15px 0" }}>or</p>

        {/* LOGIN GOOGLE */}
        <div className="googlelogin">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

        <p className="signup">
          New here?{" "}
          <span onClick={() => navigate("/register/")}>
            Register
          </span>
        </p>

      </div>

    </div>

  );
};
