import { useState, useEffect } from "react";
import { editService, createService } from "../../../Services/backendServices.js";
import "../styles/services.css"

const Services = ({ companyId }) => {
  const [listaServicios, setListaServicios] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(null); 
  const [servicioSeleccionado, setServicioSeleccionado] = useState({
    id: "",
    name: "",
    category: "comercios",
    price: "",
    direction: "",
    city_id: "",
    description: "",
    all_day: false
  });

  const categorias = [
    "fontanería", "cerrajería", "electricidad", "pintura", 
    "limpieza", "reformas", "mudanzas", "comercios", "climatización"
  ];

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const resCiudades = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cities`);
        if (resCiudades.ok) setCiudades(await resCiudades.json());

        if (companyId) {
          const resServicios = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/company/services`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          });
          if (resServicios.ok) setListaServicios(await resServicios.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    inicializarDatos();
  }, [companyId]);

  const prepararNuevoServicio = () => {
    setServicioSeleccionado({
      name: "",
      category: "comercios",
      price: "",
      direction: "",
      city_id: "",
      description: "",
      all_day: false
    });
    setModalAbierto('crear');
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    const accion = modalAbierto === 'crear' ? createService : editService;
    const resultado = await accion(servicioSeleccionado);

    if (resultado.success || resultado.ok) {
      setModalAbierto(null);
      window.location.reload(); 
    } else {
      alert("Error: " + (resultado.error || "No se pudo procesar la solicitud"));
    }
  };

  const eliminarServicio = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/service/${servicioSeleccionado.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setModalAbierto(null);
        window.location.reload();
      } else {
        alert("No se pudo eliminar el servicio");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (cargando) return <div className="text-center p-5"><h3>Cargando...</h3></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-column">
        <h2 className="my-3">Servicios ofertados</h2>
        {localStorage.getItem("user_type") === "company" && (
          <button className="btn btn-success" onClick={prepararNuevoServicio}>
            + Nuevo Servicio
          </button>
        )}
      </div>

      <div className="row">
        {listaServicios.map((srv) => (
          <div key={srv.id} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold">{srv.name}</h5>
                <span className="badge bg-success text-white mb-2">{srv.category}</span>
                <p className="mb-1 small">📍 {srv.direction}, {}</p>
                <div className="d-flex justify-content-between align-items-end mt-3">
                  <span className="h4 mb-0 text-primary">{srv.price}€</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-warning" onClick={() => { setServicioSeleccionado(srv); setModalAbierto('editar'); }}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => { setServicioSeleccionado(srv); setModalAbierto('eliminar'); }}>
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(modalAbierto === 'crear' || modalAbierto === 'editar') && (
        <div className="modal d-block modals">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className={`modal-header ${modalAbierto === 'crear' ? 'bg-success' : 'bg-warning'} text-white`}>
                <h5 className="modal-title">{modalAbierto === 'crear' ? 'Nuevo Servicio' : 'Editar Servicio'}</h5>
                <button className="btn-close btn-close-white" onClick={() => setModalAbierto(null)}></button>
              </div>
              <form onSubmit={enviarFormulario}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre</label>
                    <input type="text" className="form-control" required value={servicioSeleccionado.name}
                      onChange={(e) => setServicioSeleccionado({...servicioSeleccionado, name: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Categoría</label>
                    <select className="form-select" required value={servicioSeleccionado.category}
                      onChange={(e) => setServicioSeleccionado({...servicioSeleccionado, category: e.target.value})}>
                      {categorias.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold">Precio (€)</label>
                      <input type="number" step="0.01" className="form-control" required value={servicioSeleccionado.price}
                        onChange={(e) => setServicioSeleccionado({...servicioSeleccionado, price: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold">Ciudad</label>
                      <select className="form-select" required value={servicioSeleccionado.city_id}
                        onChange={(e) => setServicioSeleccionado({...servicioSeleccionado, city_id: e.target.value})}>
                        <option value="">Elegir...</option>
                        {ciudades.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Dirección</label>
                    <input type="text" className="form-control" required value={servicioSeleccionado.direction}
                      onChange={(e) => setServicioSeleccionado({...servicioSeleccionado, direction: e.target.value})} />
                  </div>
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" id="check24h" checked={servicioSeleccionado.all_day}
                      onChange={(e) => setServicioSeleccionado({...servicioSeleccionado, all_day: e.target.checked})} />
                    <label className="form-check-label" htmlFor="check24h">Disponible 24h</label>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(null)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary px-4">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalAbierto === 'eliminar' && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0">
              <div className="modal-body text-center p-4">
                <h4 className="text-danger mb-3">¿Desea eliminar este servicio?</h4>
                <p>Estas eliminando el servicio <strong>{servicioSeleccionado.name}</strong>. Esta acción es irreversible</p>
                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button className="btn btn-secondary" onClick={() => setModalAbierto(null)}>Cancelar</button>
                  <button className="btn btn-danger" onClick={eliminarServicio}>Borrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;