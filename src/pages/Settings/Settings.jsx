import "./Settings.scss";
import PageContent from "../../components/PageContent/PageContent";
import Sidebar from "../../components/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FitbitLogo from "../../assets/brand_logos/fitbit.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import ImageUploading from "react-images-uploading";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const authUser = useAuthUser();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${authUser().user_id}`)
      .then((res) => setSettings(res.data))
      .catch((err) => console.err(err));

    if (code) {
      axios
        .post(
          `https://api.fitbit.com/oauth2/token?client_id=${process.env.REACT_APP_FITBIT_CLIENT_ID}&code=${code}&code_verifier=${process.env.REACT_APP_FITBIT_VERIFIER}&grant_type=authorization_code`,
          {},
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          return axios.put(
            `${process.env.REACT_APP_API_URL}/users/${authUser().user_id}`,
            {
              fitbit_code: res.data.refresh_token,
            }
          );
        })
        .then(() => toast.success("Fitbit Connected!"))
        .catch((err) => console.error(err));
    }

    setImages([{ data_url: authUser() && `${authUser().user_image}` }]);
  }, []);

  const updatePersonal = (e) => {
    e.preventDefault();

    axios
      .put(`${process.env.REACT_APP_API_URL}/users/${authUser().user_id}`, {
        user_name: e.target.username.value,
        phone: e.target.phone.value,
      })
      .then(() => toast.success("Personal details updated"))
      .catch((err) => console.log(err));
  };

  const updateSecurity = (e) => {
    e.preventDefault();

    if (!e.target.password.value && !e.target.cpassword.value) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/users/${
            authUser().user_id
          }/security`,
          {
            email: e.target.email.value,
          }
        )
        .then(() => toast.success("Email updated"))
        .catch((err) => console.log(err));
    } else if (e.target.password.value !== e.target.cpassword.value) {
      toast.error("Passwords do not match!");
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/users/${
            authUser().user_id
          }/security`,
          {
            email: e.target.email.value,
            password: e.target.password.value,
          }
        )
        .then(() => toast.success("Secuirty updated"))
        .catch((err) => console.log(err));
    }
  };

  const updateImage = (e) => {
    setImages(e);
    let formData = new FormData();
    formData.append("image", e[0].file);

    axios
      .post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const userData = JSON.parse(localStorage.getItem("_auth_state"));
        userData.user_image = res.data.url;
        localStorage.setItem("_auth_state", JSON.stringify(userData));
        return axios.put(
          `${process.env.REACT_APP_API_URL}/users/${authUser().user_id}`,
          {
            profile_pic: res.data.url,
          }
        );
      })
      .then(() => {
        toast.success("Image updated!");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  if (settings) {
    return (
      <section className="settings">
        <Sidebar />
        <PageContent>
          <div className="settings__intro">
            <h2 className="settings__intro-title">
              Hey, {authUser().username}!
            </h2>
            <p className="settings__intro-welcome">
              Need to make some changes?
            </p>
          </div>
          <div className="settings__content">
            <div className="settings__main">
              <div className="settings__top">
                <div className="settings__top-profile-pic">
                  <div className="settings__top-image-container">
                    <img
                      className="settings__top-image"
                      src={images[0].data_url}
                      alt="profile-pic"
                    />
                  </div>
                  <ImageUploading
                    multiple={false}
                    value={images}
                    onChange={(e) => updateImage(e)}
                    maxNumber={23432}
                    dataURLKey="data_url"
                  >
                    {({ onImageUpload, dragProps }) => (
                      <span
                        className="settings__top-image-edit"
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </span>
                    )}
                  </ImageUploading>
                </div>
                <div className="settings__top-connections">
                  <a
                    href={`https://www.fitbit.com/oauth2/authorize?client_id=${process.env.REACT_APP_FITBIT_CLIENT_ID}&response_type=code&code_challenge=${process.env.REACT_APP_FITBIT_CHALLENGE}&code_challenge_method=S256&scope=weight%20location%20settings%20profile%20nutrition%20activity%20sleep%20heartrate%20social`}
                  >
                    <div
                      className="settings__top-connection"
                      title="Connect Fitbit Account"
                    >
                      <img
                        className="settings__top-connection-image"
                        src={FitbitLogo}
                        alt="fitbit"
                      />
                      {settings.fitbit_code ? (
                        <span className="settings__top-connection-connected">
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </a>
                </div>
              </div>
              <div className="settings__form">
                <form
                  className="settings__form-side-1"
                  onSubmit={updateSecurity}
                >
                  <div className="settings__form-security">
                    <h3 className="settings__form-title">Security Details</h3>
                    <div className="settings__form-password">
                      <Input
                        type="password"
                        placeholder="Password"
                        id="password"
                        style={{ width: "100%" }}
                        required={false}
                      />
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        id="cpassword"
                        style={{ width: "100%" }}
                        required={false}
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      style={{ width: "100%" }}
                      id="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                    <Button text="Update Security" type="primary" />
                  </div>
                </form>
                <form
                  className="settings__form-side-2"
                  onSubmit={updatePersonal}
                >
                  <div className="settings__form-personal">
                    <h3 className="settings__form-title">Personal Details</h3>
                    <Input
                      type="text"
                      placeholder="Username"
                      id="username"
                      value={settings.user_name}
                      onChange={(e) =>
                        setSettings({ ...settings, user_name: e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Phone #"
                      id="phone"
                      value={settings.phone}
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                    />
                    <Button text="Update Personal Details" type="primary" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </PageContent>
        <ToastContainer />
      </section>
    );
  } else {
    return <></>;
  }
};

export default Settings;
