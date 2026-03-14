const CompanyHeader = ({ company }) => {
  return (
    <div className="company-header bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-md-2 text-center">
            <img
              src={company?.logo || "https://via.placeholder.com/150"}
              alt={company?.name || "Empresa"}
              className="company-logo rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid #007bff" }}
            />
          </div>

          {/* Información Empresa */}
          <div className="col-md-7">
            <div className="d-flex align-items-center gap-2">
              <h1>{company?.name || "Empresa"}</h1>
              {company?.is_verified && (
                <span className="badge bg-success" title="Empresa verificada">
                  <i className="fas fa-check-circle"></i> Verificado
                </span>
              )}
            </div>
            <p className="text-muted">
              <i className="fas fa-folder-open"></i> {company?.category || "Sin categoría"}
            </p>
            <div className="rating mb-2">
              <i className="fas fa-star text-warning"></i>
              <span className="ms-2">
                {company?.rating ? company.rating.toFixed(1) : "Sin calificación"} 
                ({company?.opinions?.length || 0} opiniones)
              </span>
            </div>
            <p className="text-muted">
              <i className="fas fa-phone"></i> {company?.phone}
            </p>
            {company?.description && (
              <p className="mt-3">{company.description}</p>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="col-md-3 text-end">
            <button className="btn btn-primary btn-lg mb-2 w-100">
              <i className="fas fa-paper-plane"></i> Solicitar
            </button>
            <button className="btn btn-danger btn-lg w-100">
              <i className="fas fa-bolt"></i> Solicitar Urgente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;