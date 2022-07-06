import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./Login.scss";
import FacebookLogo from "../../assets/brand_logos/Facebook.svg";
import AppleLogo from "../../assets/brand_logos/apple.svg";
import GoogleLogo from "../../assets/brand_logos/google.svg";
//import LoginImage from '../../assets/images/login_image_mobile.svg';
//import LoginImageDesktop from '../../assets/images/login_image_desktop.svg';
import LoginImage from "../../assets/images/compete.png";
import LoginImageDesktop from "../../assets/images/compete.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, []);

  const submitLogin = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        username: e.target.username.value,
        password: e.target.password.value,
      })
      .then((res) => {
        const {
          refreshToken,
          accessToken,
          expiresIn,
          verified,
          user_email,
          user_id,
          user_image,
          admin,
        } = res.data;
        if (!verified) {
          navigate("/confirm");
        } else {
          const expiration = Date.now() + expiresIn * 60 * 1000;
          const authState = {
            username: e.target.username.value,
            user_email: user_email,
            user_id: user_id,
            user_image: user_image,
            user_type: "username",
            admin,
            expiration,
            refreshToken,
            accessToken,
          };

          if (
            signIn({
              token: accessToken,
              expiresIn: expiresIn,
              tokenType: "Bearer",
              refreshToken: refreshToken,
              authState,
            })
          ) {
            navigate("/");
          } else {
            console.error("Something went wrong");
          }
        }
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            toast.error("Password is incorrect!");
            break;
          case 403:
            toast.error("User not found 😔");
            break;
          default:
            break;
        }
      });
  };

  return (
    <>
      <section className="login">
        <div className="login__wrapper">
          <div className="login__view login__view--desktop">
            <div className="login__header">
              <h1 className="login__header-title">Sign in to</h1>
              <h2 className="login__header-subtitle">
                Your competecae dashboard
              </h2>
              <p className="login__description">
                If you don't have an account, <br /> please{" "}
                <Link to="/register">Register Here!</Link>
              </p>
            </div>
            <img
              style={{ width: "600px" }}
              className="login__image-desktop"
              src={LoginImageDesktop}
              alt="login"
            />
          </div>
          <div className="login__view">
            <form className="login__form" onSubmit={(e) => submitLogin(e)}>
              <h1 className="login__title">Login</h1>
              <Input
                id="username"
                type="text"
                placeholder="Enter Username"
                required
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
              />
              <Link className="login__forgot" to="/forgot-password">
                Forgot Password?
              </Link>
              <Button text="Login" type="primary" />
            </form>
            <div className="login__other" style={{ display: "none" }}>
              <p className="login__other-text">Or continue with...</p>
              <div className="login__other-icons">
                <img src={FacebookLogo} alt="facebook" />
                <img src={AppleLogo} alt="apple" />
                <img src={GoogleLogo} alt="google" />
              </div>
            </div>
          </div>
          <div className="login__view login__view--mobile">
            <img className="login__image" src={LoginImage} alt="login" />
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Login;
