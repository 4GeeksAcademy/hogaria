import MyBooking from "./MyBooking";
import PaymentMethods from "./PaymentMethods";
import Reviews from "./Reviews";
import Settings from "./Settings";
import Notifications from "./Notifications";

const ProfileTabs = ({ activeTab, setActiveTab, userId }) => {
    const tabs = [
        { id: "bookings", label: "Mis Reservas", icon: "fas fa-calendar" },
        { id: "payments", label: "Métodos de Pago", icon: "fas fa-credit-card" },
        { id: "reviews", label: "Valoraciones", icon: "fas fa-star" },
        { id: "settings", label: "Ajustes", icon: "fas fa-cog" },
        { id: "notifications", label: "Notificaciones", icon: "fas fa-bell" },
    ];

    console.log("🔍 ProfileTabs - activeTab:", activeTab, "userId:", userId);

    return (
        <div className="profile-tabs-section">
            <div className="container mt-4">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs profile-tabs" role="tablist">
                    {tabs.map((tab) => (
                        <li className="nav-item profile-tab" key={tab.id} role="presentation">
                            <button
                                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => {
                                    console.log("📌 Clicked tab:", tab.id);
                                    setActiveTab(tab.id);
                                }}
                                type="button"
                                role="tab"
                            >
                                <i className={tab.icon}></i> {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                    {activeTab === "bookings" && <MyBooking userId={userId} />}
                    {activeTab === "payments" && <PaymentMethods userId={userId} />}
                    {activeTab === "reviews" && <Reviews userId={userId} />}
                    {activeTab === "settings" && <Settings userId={userId} />}
                    {activeTab === "notifications" && <Notifications userId={userId} />}
                </div>
            </div>
        </div>
    );
};

export default ProfileTabs;