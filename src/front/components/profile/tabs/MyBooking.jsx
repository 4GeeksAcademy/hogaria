import { useState, useEffect } from "react";

const MyBooking = ({ userId }) => {
    const [bookings, setBookings] = useState([]);
    const [activeFilter, setActiveFilter] = useState("upcoming");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/user/bookings?user_id=${userId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (!response.ok) throw new Error("Error cargando reservas");
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchBookings();
    }, [userId]);

    const upcomingBookings = bookings.filter(
        (b) => new Date(b.date) > new Date()
    );
    const pastBookings = bookings.filter((b) => new Date(b.date) <= new Date());

    const displayedBookings =
        activeFilter === "upcoming" ? upcomingBookings : pastBookings;

    if (loading) return <p>Cargando reservas...</p>;

    return (
        <div className="my-bookings">
            {/* Filtros */}
            <div className="bookings-filters mb-4">
                <button
                    className={`btn ${activeFilter === "upcoming" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setActiveFilter("upcoming")}
                >
                    Próximas ({upcomingBookings.length})
                </button>
                <button
                    className={`btn ${activeFilter === "past" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setActiveFilter("past")}
                >
                    Pasadas ({pastBookings.length})
                </button>
            </div>

            {/* Botón CTA */}
            <button className="btn btn-success mb-4">
                <i className="fas fa-plus"></i> Solicitar Nuevo Servicio
            </button>

            {/* Lista de Reservas */}
            {displayedBookings.length === 0 ? (
                <p className="text-muted">No tienes reservas {activeFilter === "upcoming" ? "próximas" : "pasadas"}</p>
            ) : (
                <div className="bookings-list">
                    {displayedBookings.map((booking) => (
                        <div key={booking.id} className="booking-card card mb-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5 className="card-title">{booking.service_name}</h5>
                                        <p className="card-text text-muted">
                                            📅 {new Date(booking.date).toLocaleDateString("es-ES")}
                                        </p>
                                        <p className="card-text">
                                            💰 ${booking.price}
                                        </p>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        {/* Estado */}
                                        <span className={`badge bg-${getStatusClass(booking.status)}`}>
                                            {getStatusLabel(booking.status)}
                                        </span>

                                        {/* Botones de Acción */}
                                        <div className="mt-3">
                                            <button className="btn btn-sm btn-info">
                                                <i className="fas fa-phone"></i> Contactar
                                            </button>
                                            <button className="btn btn-sm btn-warning ms-2">
                                                <i className="fas fa-exclamation-triangle"></i> Reportar Problema
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function getStatusClass(status) {
    const classes = {
        confirmed: "success",
        pending: "warning",
        cancelled: "danger",
        completed: "info",
    };
    return classes[status] || "secondary";
}

function getStatusLabel(status) {
    const labels = {
        confirmed: "✓ Confirmada",
        pending: "⏳ Pendiente",
        cancelled: "✗ Cancelada",
        completed: "✓ Completada",
    };
    return labels[status] || status;
}

export default MyBooking;