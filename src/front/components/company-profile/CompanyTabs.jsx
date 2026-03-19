import Services from "./tabs/Service";
import Gallery from "./tabs/Gallery";
import Coverage from "./tabs/Coverage";
import Opinions from "./tabs/Opinions";
import Requests from "./tabs/Request";

const CompanyTabs = ({ activeTab, setActiveTab, companyId }) => {
  const tabs = [
    { id: "services", label: "Servicios", icon: "fas fa-briefcase" },
    { id: "gallery", label: "Galería", icon: "fas fa-images" },
    { id: "coverage", label: "Zonas de Cobertura", icon: "fas fa-map-marker-alt" },
    { id: "opinions", label: "Opiniones", icon: "fas fa-comments" },
    { id: "requests", label: "Solicitudes", icon: "fas fa-inbox" },
  ];

  return (
    <div className="company-tabs-section">
      <div className="container mt-4">
        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === "services" && <Services companyId={companyId} />}
          {activeTab === "gallery" && <Gallery companyId={companyId} />}
          {activeTab === "coverage" && <Coverage companyId={companyId} />}
          {activeTab === "opinions" && <Opinions companyId={companyId} />}
          {activeTab === "requests" && <Requests companyId={companyId} />}
        </div>
      </div>
    </div>
  );
};

export default CompanyTabs;