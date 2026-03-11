import { useNavigate } from "react-router-dom"
import "./chooseAccount.css"

export const ChooseAccount = () => {

    const navigate = useNavigate()

    return (

        <div className="choose-container">

            <h1 className="choose-title">Crea una cuenta</h1>

            <div className="choose-grid">

                <div
                    className="choose-card"
                    onClick={() => navigate("/register/user")}
                >
                    <h2>Usuario</h2>
                    <p>
                        Encuentra profesionales para tu hogar.
                    </p>
                    <button>Continuar</button>
                </div>

                <div
                    className="choose-card"
                    onClick={() => navigate("/register/company")}
                >
                    <h2>Empresa</h2>
                    <p>
                        Ofrece tus servicios en Hogaria.
                    </p>
                    <button>Continuar</button>
                </div>

            </div>

        </div>

    )
}