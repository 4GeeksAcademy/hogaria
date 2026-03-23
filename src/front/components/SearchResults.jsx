
export const SearchResults = ({ services }) => {

  const goToService = () => {}

  const mostrarEstrellas = (rate) => {
  if (!rate) return "Sin valorar";

  const allStarts = Math.round(rate);
  return "★".repeat(allStarts) + "☆".repeat(5 - allStarts);
  };

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
