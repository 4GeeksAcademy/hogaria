// SearchResults: Muestra los resultados de la búsqueda de profesionales en una tabla.
// Recibe como prop 'professionals', que es un array de objetos profesional.
export const SearchResults = ({ professionals }) => {
  // Si no hay resultados, no renderiza nada
  if (!professionals || professionals.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      {/* Título con el número de resultados encontrados */}
      <h3 className="mb-4">
        Resultados ({professionals.length} profesional{professionals.length !== 1 ? "es" : ""})
      </h3>

      {/* Tabla de resultados */}
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
            {/* Recorre la lista de profesionales y muestra cada uno en una fila */}
            {professionals.map((professional) => (
              <tr key={professional.id}>
                {/* Usuario (username) */}
                <td>{professional.username}</td>
                {/* Nombre completo (nombre + apellido si existe) */}
                <td>{professional.name} {professional.lastname || ""}</td>
                {/* Email */}
                <td>{professional.email}</td>
                {/* Teléfono (si no hay, muestra "No disponible") */}
                <td>{professional.telefono || "No disponible"}</td>
                {/* Servicios: muestra badges para cada servicio, o mensaje si no tiene */}
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
