export const SearchResults = ({ professionals }) => {
  if (!professionals || professionals.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      <h3 className="mb-4">
        Resultados ({professionals.length} profesional{professionals.length !== 1 ? "es" : ""})
      </h3>

      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Servicios</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((professional) => (
              <tr key={professional.id}>
                <td>{professional.username}</td>
                <td>{professional.name} {professional.lastname || ""}</td>
                <td>{professional.email}</td>
                <td>{professional.telefono || "No disponible"}</td>
                <td>
                  {professional.servicios && professional.servicios.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {professional.servicios.map((service) => (
                        <span key={service.id} className="badge bg-info">
                          {service.nombre}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">Sin servicios asignados</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
