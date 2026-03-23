
import { useState, useEffect } from "react";

export const SearchForm = ({ onSearch, initialQ, initialServiceId, initialCityId }) => {

  const [filters, setFilters] = useState({
    q: initialQ || "",
    service_id: initialServiceId || "",
    city_id: initialCityId || "",
  });

  useEffect(() => {
    setFilters({
      q: initialQ || "",
      service_id: initialServiceId || "",
      city_id: initialCityId || "",
    });
  }, [initialQ, initialServiceId, initialCityId]);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false); 

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/service-categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {

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
}, []);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';


        const [servicesRes, citiesRes] = await Promise.all([
          fetch(`${backendUrl}/api/service-categories`),
          fetch(`${backendUrl}/api/cities`),
        ]);

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
    <form onSubmit={handleSubmit} className="search-form">
      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="q" className="form-label">
            Nombre de servicio o empresa
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
        <div className="col-md-4">
          <label htmlFor="service_id" className="form-label">
            Categoría
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
