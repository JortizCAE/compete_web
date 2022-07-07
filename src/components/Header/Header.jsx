import "./Header.scss";
import { stack as Menu } from "react-burger-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faHome,
  faHeadset,
  faChevronDown,
  faEnvelope,
  faBell,
  faLayerGroup,
  faGear,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import Logo from "../../assets/logos/Monogram_Logo.svg";
import LogoInversed from "../../assets/logos/Monogram_Logo_White.svg";
import Input from "../Input/Input";
import { useIsAuthenticated, useSignOut, useAuthUser } from "react-auth-kit";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const userData = useAuthUser();

  const signUserOut = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/logout`, {
        data: {
          token: userData().refreshToken,
        },
      })
      .then((res) => {
        signOut();
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const search = (e) => {
    e.preventDefault();
    navigate("/search/" + e.target.search.value);
    e.target.search.value = "";
  };

  return (
    <header
      className="header"
      style={{ backgroundColor: isAuthenticated() ? "#fffefb" : "white" }}
    >
      <div className="header__user header__user--mobile">
        <img
          className="header__user-thumbnail"
          src={userData() && `${userData().user_image}`}
          alt="user"
        />
      </div>
      <div className="header__left">
        <div className="header__logo">
          <img className="header__logo-image" src={Logo} alt="logo" />
        </div>
        <form onSubmit={search}>
          <Input
            className="header__search"
            id="search"
            type="text"
            placeholder="Search..."
            style={{ borderRadius: "30px" }}
          />
        </form>
      </div>
      <div className="header__right">
        <div className="header__menu">
          <Link className="header__menu-item" to="/">
            Home
          </Link>
          <Link className="header__menu-item" to="/competitions">
            Competitions
          </Link>
          <Link className="header__menu-item" to="/progress">
            Progress
          </Link>
          <Link to="/new-competition">
            <Button
              style={{ padding: "2px 14px" }}
              text="New Competition"
              type="primary"
            />
          </Link>
        </div>
        <div
          className="header__icons"
          style={{ display: isAuthenticated() ? "flex" : "none" }}
        >
          <span className="header__icon icon">
            <FontAwesomeIcon icon={faBell} />
          </span>
          <span className="header__icon icon">
            <FontAwesomeIcon icon={faDollarSign} /> 34
          </span>
        </div>
        <div
          className="header__user-group"
          style={{ display: isAuthenticated() ? "flex" : "none" }}
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          <div className="header__user header__user--desktop">
            <img
              className="header__user-thumbnail"
              src={userData() && `${userData().user_image}`}
              alt="user"
            />
          </div>
          <div className="header__user-name">
            <p className="header__user-name-text">
              {userData() && userData().username}
            </p>
            <span className="header__icon">
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </div>
          <div
            className="user-dropdown"
            style={{ display: dropdownVisible ? "flex" : "none" }}
          >
            <Link className="user-dropdown__item" to="/profile">
              Profile
            </Link>
            <p className="user-dropdown__item" onClick={() => signUserOut()}>
              Log Out
            </p>
          </div>
        </div>
      </div>
      <div className="menu-mobile">
        <Menu customBurgerIcon={<FontAwesomeIcon icon={faBars} />} right>
          <img
            src={LogoInversed}
            alt="logo"
            style={{ width: "120px", marginBottom: "32px" }}
          />
          <div className="menu-mobile__list">
            <p className="menu-mobile__lable">Navigate -</p>
            <Link className="menu-mobile__item" to="/">
              Home
            </Link>
            <Link className="menu-mobile__item" to="/about">
              Competitions
            </Link>
            <Link className="menu-mobile__item" to="/new-competition">
              New Competition
            </Link>
          </div>
          <hr className="menu-mobile__devider" />
          <div
            className="menu-mobile__list"
            style={{ display: isAuthenticated() ? "none" : "block" }}
          >
            <p className="menu-mobile__lable">User -</p>
            <Link className="menu-mobile__item" to="/register">
              Register
            </Link>
            <Link className="menu-mobile__item" to="/login">
              Login
            </Link>
            <Link className="menu-mobile__item" to="/forgot-password">
              Forgot Password
            </Link>
          </div>
          <div
            className="menu-mobile__dashboard"
            style={{ display: isAuthenticated() ? "block" : "none" }}
          >
            <div className="menu-mobile__list">
              <p className="menu-mobile__lable">Dashboard -</p>
              <Link
                className="menu-mobile__item menu-mobile__item--icon"
                to="/"
              >
                <FontAwesomeIcon icon={faHome} />
                Home
              </Link>
              <Link
                className="menu-mobile__item menu-mobile__item--icon"
                to="/profile"
              >
                <FontAwesomeIcon icon={faUser} />
                Profile
              </Link>
              <Link
                className="menu-mobile__item menu-mobile__item--icon"
                to="/teams"
              >
                <FontAwesomeIcon icon={faLayerGroup} />
                Teams
              </Link>
              <Link
                className="menu-mobile__item menu-mobile__item--icon"
                to="/settings"
              >
                <FontAwesomeIcon icon={faGear} />
                Settings
              </Link>
            </div>
            <Button
              text="Log Out"
              type="secondary"
              style={{ width: "100%", marginTop: "64px" }}
              fn={() => signOut()}
            />
          </div>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
