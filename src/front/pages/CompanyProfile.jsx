import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CompanyHeader from "../components/company-profile/CompanyHeader";
import CompanyTabs from "../components/company-profile/CompanyTabs";
import "../components/company-profile/styles/company-profile.css";
import { authCheck } from "../Services/backendServices";

export const CompanyProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "services");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // const userType = localStorage.getItem("user_type");

    // if (!token || userType !== "company") {
    //   setIsAuthenticated(false);
    //   setLoading(false);
    //   return;
    // }
    console.log("estoy aca");

    setIsAuthenticated(true);

    const fetchCompanyData = async () => {
      try {

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/company`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        console.log("📊 Response status:", response.status);

        if (!response.ok) throw new Error("Error cargando perfil de empresa");
        const data = await response.json();
        console.log("✅ Company data loaded:", data);
        setCompanyData(data);
      } catch (err) {
        console.error("❌ Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5" style={{ textAlign: "center", padding: "50px" }}>
        <p>Cargando perfil de empresa...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mt-5" style={{ textAlign: "center", paddingBottom: "50px" }}>
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">¡Acceso requerido!</h4>
          <p>Debes estar autenticado como empresa para ver tu perfil.</p>
          <hr />
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5" style={{ textAlign: "center", padding: "50px" }}>
        <div className="alert alert-danger" role="alert">
          <h4>Error: {error}</h4>
          <p>No se pudo cargar el perfil de la empresa.</p>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="container mt-5" style={{ textAlign: "center", padding: "50px" }}>
        <div className="alert alert-warning" role="alert">
          <h4>Empresa no encontrada</h4>
          <p>No hay datos disponibles para esta empresa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile-page">
      <CompanyHeader company={companyData} />
      <CompanyTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        companyId={companyData?.id}
      />
    </div>
  );
};