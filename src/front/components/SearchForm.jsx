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
  const [categories, setCategories] = useState([]); // Lista de categorías
  const [cities, setCities] = useState([]);     // Lista de ciudades
  const [loadingOptions, setLoadingOptions] = useState(false); // Indica si se están cargando las opciones

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/service-categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        // Fallback si falla la API
        setCategories([
          { value: "cerrajería", label: "Cerrajería" },
          { value: "climatización", label: "Climatización" },
          { value: "fontanería", label: "Fontanería" },
          { value: "comercios", label: "Comercios" },
          { value: "electricidad", label: "Electricidad" },
          { value: "reformas", label: "Reformas" },
          { value: "limpieza", label: "Limpieza" },
          { value: "mudanzas", label: "Mudanzas" },
          { value: "categoría", label: "Categoría" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback si falla el fetch
      setCategories([
        { value: "cerrajería", label: "Cerrajería" },
        { value: "climatización", label: "Climatización" },
        { value: "fontanería", label: "Fontanería" },
        { value: "comercios", label: "Comercios" },
        { value: "electricidad", label: "Electricidad" },
        { value: "reformas", label: "Reformas" },
        { value: "limpieza", label: "Limpieza" },
        { value: "mudanzas", label: "Mudanzas" },
        { value: "categoría", label: "Categoría" },
      ]);
    }
  };
  fetchCategories();
}, []); // Solo al montar el componente

  // useEffect: Al montar el componente, carga los servicios y ciudades desde la API
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

        // Intenta obtener los datos reales de la API
        const [servicesRes, citiesRes] = await Promise.all([
          fetch(`${backendUrl}/api/service-categories`),
          fetch(`${backendUrl}/api/cities`),
        ]);

        // Si la respuesta es correcta, guarda los datos en el estado
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(Array.isArray(servicesData) ? servicesData : []);
        } else {
          setServices([
            { id: 1, name: "Plomería", category: "Oficios" },
            { id: 2, name: "Electricidad", category: "Oficios" },
            { id: 3, name: "Carpintería", category: "Oficios" },
          ]);
        }

        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setCities(Array.isArray(citiesData) ? citiesData : []);
        } else {
          setCities([
            { id: 1, name: "Madrid" },
            { id: 2, name: "Barcelona" },
            { id: 3, name: "Valencia" },
          ]);
        }
      } catch (error) {
        // Si falla la API, usa datos de ejemplo (mock)
        console.error("Error fetching filters:", error);
        setServices([
          { id: 1, name: "Plomería", category: "fontaneria" },
          { id: 2, name: "Electricidad", category: "electricidad" },
          { id: 3, name: "Carpintería", category: "Carpinteria" },
        ]);
        setCities([
          { id: 1, name: "Madrid" },
          { id: 2, name: "Barcelona" },
          { id: 3, name: "Valencia" },
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
            Buscar por name o usuario
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
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
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
                {city.name.charAt(0).toUpperCase() + city.name.slice(1)}
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
