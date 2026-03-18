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
        
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/company/${companyId}`
        );
        
        if (!response.ok) throw new Error("Error cargando perfil de empresa");
        const data = await response.json();
        setCompanyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) return <div className="container mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;

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