import "./ForgotPassword.scss";
import SplashImage from "../../assets/images/forgot_password.svg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const submitForgotPassword = (e) => {
        e.preventDefault();

        // axios
        // .put(`${process.env.REACT_APP_API_URL}/users/confirm`, {
        //     verification_code: e.target.code.value,
        // })
        // .then(res => {
        //     //
        // })
        // .catch(err => {
        //     // switch(err.response.status) {
        //     // case 403:
        //     //     toast.error("Confirmation code not found!");
        //     //     break;
        //     // case 406:
        //     //     toast.error("Something went wrong :(")
        //     //     break;
        //     // default:
        //     //     break;
        //     // }
        // });
    }

    return (
        <>
            <section className="forgot-password">
                <div className="forgot-password__wrapper">
                    <div className="forgot-password__image-container">
                        <img className="forgot-password__image" src={SplashImage} alt="forgot-password" />
                    </div>
                    <form className="forgot-password__form" onSubmit={(e) => submitForgotPassword(e)}>
                        <h2 className="forgot-password__title">Forgot Password?</h2>
                        <Input id="code" type="email" placeholder="Enter Your Email Addres" required/>
                        <Button text="Send Password Reset Link" type="primary" />
                        <p className="forgot-password__info">We will send you an email with password reset link in order for you to access the dashboard!</p>
                        <p className="login__description">If you don't have an account, <br /> please <Link to="/register">Register Here!</Link></p>
                    </form>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}

export default ForgotPassword;