import { useState, useEffect } from "react";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";

export const Search = () => {
    const [professionals, setProfessionals] = useState([]);                     //Array vacío que guardará los resultados de las busquedas. 
    const [loading, setLoading] = useState(false);                              //Indica si la búsqueda está en curso para mostrar un mensaje de "Buscando..." mientras se obtienen los resultados.
    const [searched, setSearched] = useState(false);                            //Indica si se ha realizado una búsqueda para mostrar un mensaje de "No se encontraron resultados" si la búsqueda no arroja resultados.

    const handleSearch = async (filters) => {
        setLoading(true);
        setSearched(true);

        try {
            
            const params = new URLSearchParams();                                //Construir los parámetros de consulta basados en los filtros proporcionados. Solo se agregan al query string aquellos filtros que tengan un valor (no vacíos).
            if (filters.q) params.append("q", filters.q);                           //Texto
            if (filters.service_id) params.append("service_id", filters.service_id);    
            if (filters.city_id) params.append("city_id", filters.city_id);         

            const response = await fetch(`/api/search?${params.toString()}`);
            const data = await response.json();                                 //Recibe respuesta
            setProfessionals(data);                                             //Guarda los resultados
        } catch (error) {
            console.error("Error fetching search results:", error);
            setProfessionals([]);                                               //Si falla: array vacío
        } finally {
            setLoading(false);                                                  //Dejar de mostrar "Buscando..."
        }
    };

    return (                                                                //El form recibe la función handleSearch como prop, que se ejecutará al enviar el formulario con los filtros. Mientras se cargan los resultados, se muestra un mensaje de "Buscando...". Si se ha realizado una búsqueda pero no se encontraron resultados, se muestra un mensaje de advertencia. Si hay resultados, se renderiza el componente SearchResults con los profesionales encontrados.
        <div className="container my-5">
            <h1 className="mb-4">Buscar Profesionales</h1>
                                                                                
            <SearchForm onSearch={handleSearch} />                              
            {loading && (
                <div className="alert alert-info mt-4">
                    <strong>Buscando...</strong>
                </div>
            )}

            {searched && !loading && professionals.length === 0 && (
                <div className="alert alert-warning mt-4">
                    <strong>No se encontraron resultados.</strong>
                </div>
            )}

            {professionals.length > 0 && <SearchResults professionals={professionals} />}
        </div>
    );
};
