// Importa los hooks de React necesarios
import { useState, useEffect } from "react";

// SearchForm: Formulario de búsqueda con filtros de servicio y ciudad.
// Recibe la función onSearch como prop, que se ejecuta al enviar el formulario.
export const SearchForm = ({ onSearch, initialQ, initialServiceId, initialCityId }) => {

  // Estado local para los filtros del formulario
  const [filters, setFilters] = useState({
    q: initialQ || "",           // Texto de búsqueda
    service_id: initialServiceId || "",  // ID del servicio seleccionado
    city_id: initialCityId || "",     // ID de la ciudad seleccionada
  });

  useEffect(() => {
    setFilters({
      q: initialQ || "",
      service_id: initialServiceId || "",
      city_id: initialCityId || "",
    });
  }, [initialQ, initialServiceId, initialCityId]);

  // Estados para las opciones de los selects
  const [services, setServices] = useState([]); // Lista de servicios
  const [cities, setCities] = useState([]);     // Lista de ciudades
  const [loadingOptions, setLoadingOptions] = useState(false); // Indica si se están cargando las opciones


  // useEffect: Al montar el componente, carga los servicios y ciudades desde la API
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

        // Intenta obtener los datos reales de la API
        const [servicesRes, citiesRes] = await Promise.all([
          fetch(`${backendUrl}/api/services`),
          fetch(`${backendUrl}/api/cities`),
        ]);

        // Si la respuesta es correcta, guarda los datos en el estado
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(Array.isArray(servicesData) ? servicesData : []);
        } else {
          setServices([
            { id: 1, nombre: "Plomería", categoria: "Oficios" },
            { id: 2, nombre: "Electricidad", categoria: "Oficios" },
            { id: 3, nombre: "Carpintería", categoria: "Oficios" },
          ]);
        }

        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setCities(Array.isArray(citiesData) ? citiesData : []);
        } else {
          setCities([
            { id: 1, nombre: "Madrid" },
            { id: 2, nombre: "Barcelona" },
            { id: 3, nombre: "Valencia" },
          ]);
        }
      } catch (error) {
        // Si falla la API, usa datos de ejemplo (mock)
        console.error("Error fetching filters:", error);
        setServices([
          { id: 1, nombre: "Plomería", categoria: "Oficios" },
          { id: 2, nombre: "Electricidad", categoria: "Oficios" },
          { id: 3, nombre: "Carpintería", categoria: "Oficios" },
        ]);
        setCities([
          { id: 1, nombre: "Madrid" },
          { id: 2, nombre: "Barcelona" },
          { id: 3, nombre: "Valencia" },
        ]);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []); // Solo se ejecuta una vez al montar


  // handleChange: Actualiza el estado de los filtros cuando el usuario escribe o selecciona algo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // handleSubmit: Llama a la función onSearch del padre con los filtros actuales
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  // Render del formulario
  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="row g-3">
        {/* Input de texto para búsqueda */}
        <div className="col-md-4">
          <label htmlFor="q" className="form-label">
            Buscar por nombre o usuario
          </label>
          <input
            type="text"
            className="form-control"
            id="q"
            name="q"
            placeholder="Ej: Juan, electricista..."
            value={filters.q}
            onChange={handleChange}
          />
        </div>

        {/* Select de servicios */}
        <div className="col-md-4">
          <label htmlFor="service_id" className="form-label">
            Servicio
          </label>
          <select
            className="form-control"
            id="service_id"
            name="service_id"
            value={filters.service_id}
            onChange={handleChange}
          >
            <option value="">Todos los servicios</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Select de ciudades */}
        <div className="col-md-4">
          <label htmlFor="city_id" className="form-label">
            Ciudad
          </label>
          <select
            className="form-control"
            id="city_id"
            name="city_id"
            value={filters.city_id}
            onChange={handleChange}
          >
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón de enviar */}
      <div className="row g-3 mt-2">
        <div className="col-md-4 offset-md-4">
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
};
