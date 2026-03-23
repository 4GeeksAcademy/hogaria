import { useNavigate } from "react-router-dom";

// SearchResults: Muestra los resultados de la búsqueda de profesionales en una tabla.
// Recibe como prop 'services', que es un array de objetos profesional.
export const SearchResults = ({ services }) => {
  const navigate = useNavigate();

  const goToService = () => {}

  const mostrarEstrellas = (rate) => {
    if (!rate) return "Sin valorar";

    const allStarts = Math.round(rate);
    return "★".repeat(allStarts) + "☆".repeat(5 - allStarts);
  };

  const handleSelectService = (service) => {
    const productName = `${service.name} - ${service.company_name}`;
    const amount = Number(service.price) || 0;
    const params = new URLSearchParams({
      productName,
      amount: String(amount),
      serviceId: String(service.id),
    });

    navigate(`/checkout?${params.toString()}`, {
      state: {
        serviceId: service.id,
        productName,
        amount,
        service,
      },
    });
  };

  // Si no hay resultados, no renderiza nada
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="results-container">

      <h3 className="mb-4">
        Resultados ({services.length} servicio{services.length !== 1 ? "s" : ""})
      </h3>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Empresa</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Valoración</th>
              <th>Precio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} onClick={goToService}>
                <td>{service.name}</td>

                <td>{service.company_name}</td>

                <td>{service.company_email}</td>

                <td>{service.company_phone}</td>

                <td>{mostrarEstrellas(Number(service.company_rate).toFixed(1))} {Number(service.company_rate).toFixed(1)}</td>

                <td>{service.price} €</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSelectService(service)}
                  >
                    Seleccionar servicio
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
