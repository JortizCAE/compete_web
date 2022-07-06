import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NotFound.scss";
import NotFoundImage from "../../assets/images/not_found.svg";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <section className="not-found">
            <div className="not-found__wrapper">
                <span className="not-found__back" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /> Go Back</span>
                <div className="not-found__content">
                    <div className="not-found__image-container">
                        <img className="not-found__image" src={NotFoundImage} alt="not-found" />
                    </div>
                    <div className="not-found__info">
                        <h1 className="not-found__info-title">Opps...</h1>
                        <h2 className="not-found__info-sub">Page Not Found!!</h2>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NotFound;