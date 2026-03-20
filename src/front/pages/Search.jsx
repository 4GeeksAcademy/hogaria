import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import "./search.css";
import { authCheck } from "../Services/backendServices";
import { useNavigate } from "react-router-dom";


// Datos de ejemplo para mostrar cuando la API falla
const exampleProfessional = [
    {
        id: 1,
        username: "juanplomero",
        name: "Juan",
        lastname: "García",
        email: "juan@example.com",
        telefono: "600123456",
        servicios: [
            { id: 1, nombre: "Plomería" },
            { id: 2, nombre: "Reparaciones" }
        ]
    }
];

export const Search = () => {
    // Hook para acceder a los parámetros de búsqueda en la URL (por ejemplo, ?q=plomería)
    const [searchParams] = useSearchParams();
    // Leer valores iniciales de la URL
    const params = new URLSearchParams(searchParams);

    const serviceId = params.get("service_id");
    const q = params.get("q");
    const cityId = params.get("city_id");
    const initialServiceId = serviceId || "";
    const initialQ = serviceId ? "" : (q || "");
    const initialCityId = cityId || "";

    const [professionals, setProfessionals] = useState([]); // Resultados de búsqueda
    const [loading, setLoading] = useState(false);           // Estado de carga
    const [searched, setSearched] = useState(false);         // Si ya se buscó

    // Función para buscar profesionales con los filtros dados
    // Resultado de ejemplo para mostrar si la búsqueda real no devuelve nada


    // handleSearch: lógica real, pero si no hay resultados, muestra el ejemplo
    const handleSearch = async (filters) => {
        const navigate = useNavigate();
        setLoading(true);
        setSearched(true);
        try {
            const params = new URLSearchParams();
            if (filters.q) params.append("q", filters.q);
            if (filters.service_id) params.append("service_id", filters.service_id);
            if (filters.city_id) params.append("city_id", filters.city_id);
            navigate(`/search?${params.toString()}`);
            // Intentar con VITE_BACKEND_URL primero, luego con ruta relativa
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            
            const response = await fetch(`${backendUrl}/api/search?${params.toString()}`);

            if (!response.ok) {
                console.warn(`API returned ${response.status}, using sample data`);
                setProfessionals(exampleProfessional);
                return;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('API did not return JSON, using sample data');
                setProfessionals(exampleProfessional);
                return;
            }

            const data = await response.json();
            // Si la búsqueda real devuelve resultados, muéstralos
            if (Array.isArray(data) && data.length > 0) {
                setProfessionals(data);
            } else {
                setProfessionals(exampleProfessional);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setProfessionals(exampleProfessional);
        } finally {
            setLoading(false);
        }
    };

    // useEffect: lanza la búsqueda automática si hay algún filtro en la URL
    useEffect(() => {
        if (initialQ || initialServiceId || initialCityId) {
            handleSearch({
                q: initialQ,
                service_id: initialServiceId,
                city_id: initialCityId
            });
        }
        // eslint-disable-next-line
    }, [initialQ, initialServiceId, initialCityId]);

    return (
        <div className="search-page">
            <div className="search-container">
                <h1 className="text-white mb-4" style={{ fontSize: "2rem", fontWeight: "600" }}>Buscar Profesionales</h1>
                {/* Pasamos los valores iniciales al formulario */}
                <SearchForm
                    onSearch={handleSearch}
                    initialQ={initialQ}
                    initialServiceId={initialServiceId}
                    initialCityId={initialCityId}
                />
                {loading && (
                    <div className="search-loading">
                        <p><strong>Buscando...</strong></p>
                    </div>
                )}
                {searched && !loading && professionals.length === 0 && (
                    <div className="empty-search-state">
                        <p><strong>No se encontraron resultados.</strong></p>
                    </div>
                )}
                {professionals.length > 0 && <SearchResults professionals={professionals} />}
            </div>
        </div>
    );
};
