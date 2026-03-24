import React, { useRef } from "react";

const CompanyHeader = ({ company, onLogoUpdate }) => {
  const fileInputRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem("user_id");

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch(`${backendUrl}/api/company/update-logo?user_id=${userId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData, // Importante: No poner Content-Type manual para FormData
      });

      if (response.ok) {
        const data = await response.json();
        alert("Logo actualizado");
        if (onLogoUpdate) onLogoUpdate(data.logo_url);
        window.location.reload(); // Recarga rápida para ver el cambio
      }
    } catch (error) {
      alert("Error al subir el logo");
    }
  };

  return (
    <div className="company-header bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-2 text-center position-relative">
            <div 
              onClick={handleLogoClick} 
              style={{ cursor: "pointer", position: "relative", display: "inline-block" }}
              title="Cambiar logo"
            >
              <img
                src={company?.logo || "https://placehold.co/150"}
                alt={company?.name}
                className="company-logo rounded-circle shadow"
                style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid #198754" }}
              />
              <div className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-2 shadow-sm" style={{ width: "35px", height: "35px" }}>
                <i className="fas fa-camera fa-sm"></i>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: "none" }} 
              accept="image/*" 
            />
          </div>

          <div className="col-md-7 mx-3">
            <div className="d-flex align-items-center gap-2">
              <h1>{company?.name || "Empresa"}</h1>
              {company?.is_verified && (
                <span className="badge bg-success">
                  <i className="fas fa-check-circle"></i> Verificado
                </span>
              )}
            </div>
            {/* ... resto de tu código igual ... */}
            <div className="mt-2">
              {company?.categories?.map((cat, i) => (
                <span key={i} className="badge bg-success me-2">{cat}</span>
              ))}
            </div>
            <p className="text-muted mt-2"><i className="fas fa-phone"></i> {company?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;