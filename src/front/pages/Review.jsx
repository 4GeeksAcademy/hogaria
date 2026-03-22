import { useState, useEffect} from "react"
import "./review.css"
import { useNavigate } from "react-router-dom";

export const Review = () => {

        const [review, setReview] = useState({
                company_id: "",
                service_id: "",
                rating: "",
                comment: "",
                user_id: localStorage.getItem("user_id")
        })

       const [companies, setCompanies] = useState([]);
        const [services, setServices] = useState([]);
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();
        const userType = localStorage.getItem("user_type");
        const userId = localStorage.getItem("user_id"); // Asegúrate de tener el ID guardado

    useEffect(() => {
        // Si no está logueado o no es un particular, fuera de aquí
        if (!userType || userType !== "user") {
            alert("Solo los clientes particulares pueden dejar valoraciones.");
            navigate("/");
        }
    }, [userType, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            try {
                const [companies, services] = await Promise.all([
                    fetch(`${backendUrl}/api/companies`), // Necesitas este endpoint
                    fetch(`${backendUrl}/api/services`)   // Y este otro
                ]);

                if (companies.ok) setCompanies(await companies.ok ? await companies.json() : []);
                if (services.ok) setServices(await services.ok ? await services.json() : []);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const filteredServices = services.filter(
        (s) => s.company_id === parseInt(review.company_id)
    );
        
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Obtenemos los datos frescos justo antes de enviar
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("No se encontró ID de usuario. Por favor, re-loguea.");
        return;
    }

    // Construimos el cuerpo del mensaje asegurando tipos de datos
    const dataToSend = {
        company_id: parseInt(review.company_id),
        rating: parseInt(review.rating),
        comment: review.comment,
        user_id: parseInt(userId) // Convertimos a entero aquí
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();

        if (response.ok) {
            alert("¡Opinión enviada correctamente!");
            setReview({ company_id: "", service_id: "", rating: "", comment: "" });
        } else {
            // Esto te mostrará el error real del backend en un alert
            alert("Error: " + result.error); 
        }
    } catch (error) {
        console.error("Error en el POST:", error);
    }
};

    if (loading) return <p className="text-center">Cargando datos...</p>;

    return (
<div className="review-container">
            <form className="review-form" onSubmit={handleSubmit}>
                <label>Empresa</label>
                <select
                    value={review.company_id}
                    required
                    onChange={(e) => {
                        setReview({ ...review, company_id: e.target.value, service_id: "" });
                    }}
                >
                    <option value="">Selecciona una empresa</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <label>Servicio</label>
                <select
                    value={review.service_id}
                    required
                    disabled={!review.company_id} 
                    onChange={(e) => setReview({ ...review, service_id: e.target.value })}
                >
                    <option value="">
                        {!review.company_id 
                            ? "Primero selecciona una empresa" 
                            : "Selecciona un servicio"}
                    </option>
                    {filteredServices.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <label>Puntuación</label>
                <select
                    value={review.rating}
                    required
                    onChange={(e) => setReview({ ...review, rating: e.target.value })}
                >
                    <option value="">Selecciona</option>
                    <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                    <option value="4">⭐⭐⭐⭐ (Muy bueno)</option>
                    <option value="3">⭐⭐⭐ (Normal)</option>
                    <option value="2">⭐⭐ (Pobre)</option>
                    <option value="1">⭐ (Muy malo)</option>
                </select>

                <label>Comentario</label>
                <textarea
                    rows="4"
                    required
                    placeholder="Cuéntanos tu experiencia"
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                />

                <button type="submit">Enviar valoración</button>
            </form>
        </div>
    );
};