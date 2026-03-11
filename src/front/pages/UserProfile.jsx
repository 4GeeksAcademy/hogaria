import { useState, useEffect } from "react";
import UserProfileHeader from "../components/profile/tabs/UserProfileHeader";
import ProfileTabs from "../components/profile/tabs/ProfileTabs";
import "../components/profile/styles/profile.css";

export const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("bookings");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Obtener user_id del query string o del localStorage
                const userId = new URLSearchParams(window.location.search).get('user_id') || localStorage.getItem('user_id') || 1;

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/profile?user_id=${userId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Error cargando perfil");
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div className="container mt-5"><p>Cargando...</p></div>;
    if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;

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