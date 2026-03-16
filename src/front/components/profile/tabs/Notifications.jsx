import { useState, useEffect } from "react";

const Notifications = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/user/notifications?user_id=${userId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchNotifications();
    }, [userId]);

    if (loading) return <p>Cargando notificaciones...</p>;

    return (
        <div className="notifications">
            {notifications.length === 0 ? (
                <p className="text-muted">No tienes notificaciones nuevas</p>
            ) : (
                <div className="notifications-list">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="alert" style={{
                            backgroundColor: notif.is_read ? "#f8f9fa" : "#e7f3ff",
                            borderLeft: `4px solid ${notif.is_read ? "#dee2e6" : "#0d6efd"}`
                        }}>
                            <h6>{notif.title}</h6>
                            <p>{notif.message}</p>
                            <small className="text-muted">
                                {new Date(notif.created_at).toLocaleDateString("es-ES")}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;