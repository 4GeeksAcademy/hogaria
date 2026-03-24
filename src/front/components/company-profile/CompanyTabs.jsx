import Services from "./tabs/Service";
import Gallery from "./tabs/Gallery";
import Opinions from "./tabs/Opinions";
import Requests from "./tabs/Request";
import Settings from "../profile/tabs/Settings"; // Reutilizar Settings de usuario

const CompanyTabs = ({ activeTab, setActiveTab, companyId }) => {
  const tabs = [
    { id: "services", label: "Servicios", icon: "fas fa-briefcase" },
    { id: "gallery", label: "Galería", icon: "fas fa-images" },
    { id: "opinions", label: "Opiniones", icon: "fas fa-comments" },
    { id: "requests", label: "Solicitudes", icon: "fas fa-inbox" },
    { id: "settings", label: "Ajustes", icon: "fas fa-cog" },
  ];

  return (
    <div className="company-tabs-section">
      <div className="container mt-4">
        <ul className="nav nav-tabs" role="tablist">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id} role="presentation">
              <button
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <i className={tab.icon}></i> {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content mt-4">
          {activeTab === "services" && <Services companyId={companyId} />}
          {activeTab === "gallery" && <Gallery companyId={companyId} />}
          {activeTab === "opinions" && <Opinions companyId={companyId} />}
          {activeTab === "requests" && <Requests companyId={companyId} />}
          {activeTab === "settings" && <Settings userId={companyId} entityType="company" />}
        </div>
      </div>
    </div>
  );
};

export default CompanyTabs;