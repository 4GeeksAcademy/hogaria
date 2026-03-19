import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CompanyHeader from "../components/company-profile/CompanyHeader";
import CompanyTabs from "../components/company-profile/CompanyTabs";
import "../components/company-profile/styles/company-profile.css";

export const CompanyProfile = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "services");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Obtener company_id desde URL (query parameter)
        const companyId = new URLSearchParams(window.location.search).get('company_id') || 1;
        console.log("🔍 CompanyProfile - Fetching company:", companyId);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/company/${companyId}`
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