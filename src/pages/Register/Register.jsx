import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./Register.scss";
import FacebookLogo from "../../assets/brand_logos/Facebook.svg";
import AppleLogo from "../../assets/brand_logos/apple.svg";
import GoogleLogo from "../../assets/brand_logos/google.svg";
import registerImage from "../../assets/images/compete.png";
import registerImageDesktop from "../../assets/images/compete.png";
// import registerImage from "../../assets/images/login_image_mobile.svg";
// import registerImageDesktop from "../../assets/images/login_image_desktop.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const submitRegister = (e) => {
    e.preventDefault();

    if (e.target.password.value !== e.target.cpassword.value) {
      toast.warn("Passwords do not match!");
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/users`, {
          user_name: e.target.username.value,
          password: e.target.password.value,
          email: e.target.email.value,
          phone: e.target.phone.value,
        })
        .then((res) => {
          return axios.post(`${process.env.REACT_APP_API_URL}/notify/email`, {
            email: e.target.email.value,
            subject: "Complete Your Registration!",
            text: `Use code ${res.data.verification_code} to confirm your registration.`,
            html: `Use code ${res.data.verification_code} to confirm your registration.`,
          });
        })
        .then(() => {
          navigate("/confirm");
        })
        .catch((err) => {
          console.log(err);
          switch (err.response.status) {
            case 403:
              toast.error("An account is already registered using that email!");
              break;
            case 406:
              toast.error("That username is already taken!");
              break;
            default:
              break;
          }
        });
    }
  };

  return (
    <>
      <section className="register">
        <div className="register__wrapper">
          <div className="register__view register__view--desktop">
            <div className="register__header">
              <h1 className="register__header-title">Sign up to</h1>
              <h2 className="register__header-subtitle">
                Beat your own limitations
              </h2>
              <p className="register__description">
                If you already have an account, <br /> please{" "}
                <Link to="/login">Login Here!</Link>
              </p>
            </div>
            <img
              className="register__image-desktop"
              style={{ width: "600px" }}
              src={registerImageDesktop}
              alt="register"
            />
          </div>
          <div className="register__view">
            <form
              className="register__form"
              onSubmit={(e) => submitRegister(e)}
            >
              <h1 className="register__title">Register</h1>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                required
              />
              <Input
                id="username"
                type="text"
                placeholder="Create Username"
                required
              />
              <Input id="phone" type="tel" placeholder="Contact number" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
              />
              <Input
                id="cpassword"
                type="password"
                placeholder="Confirm Password"
                required
              />
              <Button text="Register" type="primary" />
            </form>
            <div className="register__other" style={{ display: "none" }}>
              <p className="register__other-text">Or continue with...</p>
              <div className="register__other-icons">
                <img src={FacebookLogo} alt="facebook" />
                <img src={AppleLogo} alt="apple" />
                <img src={GoogleLogo} alt="google" />
              </div>
            </div>
          </div>
          <div className="register__view register__view--mobile">
            <img
              className="register__image"
              src={registerImage}
              alt="register"
            />
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Register;
