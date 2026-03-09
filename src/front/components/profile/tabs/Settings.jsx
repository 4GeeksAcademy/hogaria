import { useState, useEffect } from "react";

const Settings = ({ userId }) => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/profile?user_id=${userId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setFormData((prev) => ({
                        ...prev,
                        email: data.email || "",
                        phone: data.phone || "",
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/user/profile?user_id=${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        phone: formData.phone,
                    }),
                }
            );

            if (!response.ok) throw new Error("Error actualizando perfil");

            setMessage("✓ Perfil actualizado correctamente");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(`✗ ${err.message}`);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/user/change-password?user_id=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        current_password: formData.currentPassword,
                        new_password: formData.newPassword,
                    }),
                }
            );

            if (!response.ok) throw new Error("Error cambiando contraseña");

            setMessage("✓ Contraseña actualizada correctamente");
            setFormData({
                ...formData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(`✗ ${err.message}`);
        }
    };

    return (
        <div className="settings-page">
            {/* Alertas */}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Sección 1: Datos Personales */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5>Datos Personales</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+34 612 345 678"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>

            {/* Sección 2: Cambiar Contraseña */}
            <div className="card">
                <div className="card-header">
                    <h5>Cambiar Contraseña</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                            <label htmlFor="currentPassword" className="form-label">
                                Contraseña Actual
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-warning">
                            Cambiar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;