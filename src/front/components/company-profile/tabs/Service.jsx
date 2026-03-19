import { useState, useEffect } from "react";

const Services = ({ companyId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/company/${companyId}/services`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchServices();
  }, [companyId]);

  if (loading) return <p>Cargando servicios...</p>;

  return (
    <div className="services-section">
      {services.length === 0 ? (
        <p className="text-muted">Esta empresa no tiene servicios publicados</p>
      ) : (
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-md-6 mb-4">
              <div className="service-card card h-100">
                <div className="card-body">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text text-muted">{service.category}</p>
                  {service.description && (
                    <p className="card-text">{service.description}</p>
                  )}
                  <p className="card-text">
                    <strong>Ubicación:</strong> {service.direction}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="badge bg-primary">${service.price}</span>
                    {service.all_day && (
                      <span className="badge bg-success">Disponible 24/7</span>
                    )}
                  </div>
                  <button className="btn btn-sm btn-primary mt-3 w-100">
                    Contratar Servicio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;