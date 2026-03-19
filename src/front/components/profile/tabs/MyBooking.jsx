import { useState, useEffect } from "react";

const MyBooking = ({ userId }) => {
    const [bookings, setBookings] = useState([]);
    const [activeFilter, setActiveFilter] = useState("upcoming");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔍 MyBooking Debug - userId recibido:", userId);

        if (!userId) {
            console.warn("⚠️ userId es undefined");
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/bookings?user_id=${userId}`;
                console.log("🔗 Fetching from:", url);

                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                console.log("📊 Response status:", response.status);

                if (!response.ok) throw new Error("Error cargando reservas");
                const data = await response.json();
                console.log("✅ Bookings cargadas:", data);
                setBookings(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("❌ Error:", error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId]);

    const upcomingBookings = bookings.filter((b) => b.date && new Date(b.date) > new Date());
    const pastBookings = bookings.filter((b) => b.date && new Date(b.date) <= new Date());
    const displayedBookings = activeFilter === "upcoming" ? upcomingBookings : pastBookings;

    if (loading) {
        return <p className="text-muted">Cargando reservas...</p>;
    }

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
            <div className="mb-4">
                <button className="btn btn-success btn-lg">
                    <i className="fas fa-plus me-2"></i> Solicitar Nuevo Servicio
                </button>
            </div>

            {/* Lista de Reservas */}
            {displayedBookings.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    <h5 className="alert-heading">Sin reservas</h5>
                    <p className="mb-0">
                        No tienes reservas {activeFilter === "upcoming" ? "próximas" : "pasadas"}.
                    </p>
                </div>
            ) : (
                <div className="bookings-list">
                    {displayedBookings.map((booking) => (
                        <div key={booking.id} className="booking-card card mb-3 border-start border-4 border-primary">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5 className="card-title">{booking.service_name || "Servicio"}</h5>
                                        <p className="card-text text-muted">
                                            <strong>📅 Fecha:</strong>{" "}
                                            {booking.date
                                                ? new Date(booking.date).toLocaleDateString("es-ES")
                                                : "N/A"}
                                        </p>
                                        <p className="card-text">
                                            <strong>💰 Precio:</strong> ${booking.price || "0"}
                                        </p>
                                    </div>
                                    <div className="col-md-6 d-flex flex-column align-items-end justify-content-center">
                                        <span
                                            className={`badge bg-${getStatusClass(
                                                booking.status
                                            )} mb-3`}
                                        >
                                            {getStatusLabel(booking.status)}
                                        </span>
                                        <div className="btn-group" role="group">
                                            <button className="btn btn-sm btn-info" title="Contactar">
                                                <i className="fas fa-phone me-2"></i>Contactar
                                            </button>
                                            <button className="btn btn-sm btn-warning" title="Reportar">
                                                <i className="fas fa-exclamation-triangle me-2"></i>Reportar
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
