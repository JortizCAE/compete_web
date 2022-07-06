import "./ConfirmEmail.scss";
import SplashImage from "../../assets/images/confirm_email.svg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmEmail = () => {
    const [isVerified, setIsVerified] = useState(false);

    const submitConfirmEmail = (e) => {
        e.preventDefault();

        axios
        .put(`${process.env.REACT_APP_API_URL}/users/confirm`, {
            verification_code: e.target.code.value,
        })
        .then(res => {
            setIsVerified(true);
        })
        .catch(err => {
            switch(err.response.status) {
            case 403:
                toast.error("Confirmation code not found!");
                break;
            case 406:
                toast.error("Something went wrong :(")
                break;
            default:
                break;
            }
        });
    }

    return (
        <>
            <section className="confirm-email">
                <div className="confirm-email__wrapper">
                    <div className="confirm-email__image-container">
                        <img className="confirm-email__image" src={SplashImage} alt="confirm-email" />
                    </div>
                    <form className="confirm-email__form" onSubmit={(e) => submitConfirmEmail(e)} style={{ display: isVerified ? "none" : "flex" }}>
                        <h2 className="confirm-email__title">Email Confirmation ✔️</h2>
                        <Input id="code" type="number" placeholder="Enter Your 9 Digit Code" size={9} maxlength={9} required/>
                        <Button text="Confirm" type="primary" />
                        <p className="confirm-email__info">We've sent you an email with a confirmation code to validate your email address! Please copy and paste the code avobe to access your account.</p>
                        <p className="login__description">If you don't have an account, <br /> please <Link to="/register">Register Here!</Link></p>
                    </form>
                    <div className="confirm-email__verified" style={{ display: isVerified ? "flex" : "none" }}>
                        <h3 className="confirm-email__verified-title">Thank you for verifying your email address!</h3>
                        <p className="login__description">Your account is ready! Please <Link to="/login">Login Here!</Link></p>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}

export default ConfirmEmail;