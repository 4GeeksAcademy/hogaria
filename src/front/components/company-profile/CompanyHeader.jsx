const CompanyHeader = ({ company }) => {
  return (
    <div className="company-header bg-light py-5">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-md-2 text-center">
            <img
              src={company?.logo || "https://placehold.co/150"}
              alt={company?.name || "Empresa"}
              className="company-logo rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid #007bff" }}
            />
          </div>

          <div className="col-md-7 mx-3">
            <div className="d-flex align-items-center gap-2">
              <h1>{company?.name || "Empresa"}</h1>
              {company?.is_verified && (
                <span className="badge bg-success" title="Empresa verificada">
                  <i className="fas fa-check-circle"></i> Verificado
                </span>
              )}
            </div>
            <div className="mt-2">
              {company?.categories?.map((category, index) => (
              <span
                key={index}
                className="badge bg-success me-2"
                style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#10b981"}
                onMouseLeave={(e) => e.target.style.backgroundColor = ""}
              >
                {category}
              </span>
              ))}
            </div>
            <p className="text-muted">
            </p>
            <div className="rating mb-2">
              <i className="fas fa-star text-warning"></i>
              <span className="ms-2">
                {company?.rate ? company.rate.toFixed(1) : "Sin calificación"}
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
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;