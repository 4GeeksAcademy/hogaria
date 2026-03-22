import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserProfileHeader from "../components/profile/tabs/UserProfileHeader";
import ProfileTabs from "../components/profile/tabs/ProfileTabs";
import "../components/profile/styles/profile.css";
import { authCheck } from "../Services/backendServices";


export const UserProfile = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "bookings");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);

        const fetchUserData = async () => {
            try {
                // Obtener user_id del query string o del localStorage
                const userId = new URLSearchParams(window.location.search).get('user_id') || localStorage.getItem('user_id');
                const userType = new URLSearchParams(window.location.search).get('user_type') || localStorage.getItem('user_type');
                console.log("User ID:", userId, "User Type:", userType);
                if (!userId || !userType) {
                    throw new Error("No se pudo determinar el usuario autenticado");
                }
                if (userType === "user") {
                    const response = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/profile?user_id=${userId}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );
                    if (!response.ok) throw new Error("Error cargando perfil");
                    const data = await response.json();
                    setUserData(data);

                } else if (userType === "company") {
                    const response = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/company-profile?company_id=${userId}`,
                            {
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                },
                            }
                        );
                    if (!response.ok) throw new Error("Error cargando perfil");
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="container mt-5" style={{ textAlign: "center", paddingBottom: "50px" }}>
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">¡Acceso requerido!</h4>
                    <p>Debes estar autenticado para ver tu perfil.</p>
                    <hr />
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => navigate("/login")}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/register")}
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <div className="container mt-5"><p>Cargando...</p></div>;
    if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p><p className="text-muted mt-3">Por favor, intenta nuevamente o contacta soporte.</p></div>;
    if (!userData) return <div className="container mt-5"><p className="text-warning">No hay datos disponibles para este usuario.</p></div>;

    return (
        <div className="user-profile-page">
            <UserProfileHeader user={userData} />
            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userId={userData?.id}
            />
        </div>
    );
};