import "./Sidebar.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLayerGroup, faRightFromBracket, faHome, faGear, faShield } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";

const Sidebar = () => {
    const pageURL = useLocation().pathname;
    const signOut = useSignOut();
    const authUser = useAuthUser();

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <h3>Dashboard</h3>
            </div>
            <div className="sidebar__menu">
                <Link className={"sidebar__menu-item" + (pageURL === "/" ? " sidebar__menu-item--active" : "") } to="/">
                    <FontAwesomeIcon icon={faHome} />
                    Home
                </Link>
                <Link className={"sidebar__menu-item" + (pageURL === "/profile" ? " sidebar__menu-item--active" : "") } to="/profile">
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                </Link>
                <Link className={"sidebar__menu-item" + (pageURL === "/teams" ? " sidebar__menu-item--active" : "") } to="/teams">
                    <FontAwesomeIcon icon={faLayerGroup} />
                    Teams
                </Link>
                {
                    authUser().admin ?
                    <Link className={"sidebar__menu-item" + (pageURL === "/admin" ? " sidebar__menu-item--active" : "") } to="/admin">
                        <FontAwesomeIcon icon={faShield} />
                        Admin Area
                    </Link> : ""
                }
            </div>
            <div className="sidebar__footer">
                <Link className={"sidebar__menu-item" + (pageURL === "/settings" ? " sidebar__menu-item--active" : "") } to="/settings">
                    <FontAwesomeIcon icon={faGear} />
                    Settings
                </Link>
                <span className="sidebar__footer-item" onClick={() => signOut()}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Log Out
                </span>
            </div>
        </div>
    );
}

export default Sidebar;