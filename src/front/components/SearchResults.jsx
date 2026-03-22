// SearchResults: Muestra los resultados de la búsqueda de profesionales en una tabla.
// Recibe como prop 'services', que es un array de objetos profesional.
export const SearchResults = ({ services }) => {

  const mostrarEstrellas = (rate) => {
  if (!rate) return "Sin valorar";

  const allStarts = Math.round(rate);
  return "★".repeat(allStarts) + "☆".repeat(5 - allStarts);
  };
  // Si no hay resultados, no renderiza nada
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      {/* Título con el número de resultados encontrados */}
      <h3 className="mb-4">
        Resultados ({services.length} profesional{services.length !== 1 ? "es" : ""})
      </h3>

      {/* Tabla de resultados */}
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
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>

                <td>{service.company_name}</td>

                <td>{service.company_email}</td>

                <td>{service.company_phone}</td>

                <td>{mostrarEstrellas(Number(service.company_rate).toFixed(1))} {Number(service.company_rate).toFixed(1)}</td>

                <td>{service.price} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
