import { NavDropdown } from "react-bootstrap";
import { useContext } from "react";

import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";

import "./DropdownUser.css";

import userIcon from "../../assets/user 2.png";
import logoutIcon from "../../assets/logout 1.png";

const DropdownUser = ({ logout, id }) => {
  const [state] = useContext(UserContext);
  return (
    <>
      <NavDropdown
        title={
          <div>
            <img
              className="thumbnail-image rounded-circle"
              src={state.image}
              alt="user pic"
            />
          </div>
        }
        id="basic-nav-dropdown"
      >
        <NavDropdown.Item>
          <Link to={`/profile-user/${id}`} className="link">
            <img
              src={userIcon}
              width="20"
              height="20"
              alt="userIcon"
              className="me-2"
            />
            Profile
          </Link>
        </NavDropdown.Item>

        <NavDropdown.Divider />

        <Link to="/" className="link" onClick={logout}>
          <NavDropdown.Item>
            <img
              src={logoutIcon}
              width="20"
              height="20"
              alt="userIcon"
              className="me-1"
            ></img>
            Logout
          </NavDropdown.Item>
        </Link>
      </NavDropdown>
    </>
  );
};

export default DropdownUser;
