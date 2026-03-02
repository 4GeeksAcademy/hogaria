import { useState, useEffect } from "react";

export const SearchForm = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    q: "",
    service_id: "",
    city_id: "",
  });

  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Fetch services and cities on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Try to fetch real data from API
        const [servicesRes, citiesRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/cities"),
        ]);

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
        }

        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setCities(citiesData);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
        // If API not available yet, use placeholder data
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4">
      <div className="row g-3">
        {/* Search input */}
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

        {/* Service filter */}
        <div className="col-md-4">
          <label htmlFor="service_id" className="form-label">
            Servicio
          </label>
          <select
            className="form-select"
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

        {/* City filter */}
        <div className="col-md-4">
          <label htmlFor="city_id" className="form-label">
            Ciudad
          </label>
          <select
            className="form-select"
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

      {/* Submit button */}
      <div className="row mt-3">
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
};
