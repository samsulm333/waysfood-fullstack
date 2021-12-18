import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Badge } from "react-bootstrap";

import { UserContext } from "../../context/userContext";
import { CartContext } from "../../context/cartContext";

// import styles
import {
  nav,
  logoStyle,
  img,
  navButton,
  logoText,
  badgeCart,
} from "./Navbar.module.css";

// import assets
import logo from "../../assets/logo.png";
import cartLogo from "../../assets/cartlogo.png";

// import component
import AuthModal from "../AuthModal";
import DropdownUser from "../dropdownUser";
import DropdownPartner from "../DropdownPartner";
// import NavCartButton from "../NavCartButton";

const NavbarComponent = () => {
  // state initial
  const [state, dispatch] = useContext(UserContext);
  const [cart, cartDispatch] = useContext(CartContext);
  const cartQty = cart.cartItems.reduce(
    (acc, item) => acc + parseInt(item.qty),
    0
  );

  let navigate = useNavigate();

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  useEffect(() => {
    const localcart = JSON.parse(localStorage.getItem("cart"));

    if (localcart === null) {
      console.log(localcart);
    } else {
      cartDispatch({
        type: "CART_ADD_ITEM",
        payload: {
          id: localcart.partnerId,
          items: localcart.cartItems,
          isCheckout: localcart.isCheckout,
        },
      });
    }
  }, []);

  return (
    <div>
      <nav className={nav}>
        <Link to="/" className={logoStyle}>
          <h1 className={logoText}>WaysFood</h1>
          <img className={img} src={logo} alt="logo" />
        </Link>

        {state.role === "customer" ? (
          <div className={navButton}>
            <Link to="/cart">
              <img
                src={cartLogo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="cart-logo"
              />
              {cart.cartItems.length ? (
                <Badge
                  bg="danger"
                  text="light"
                  className={`${badgeCart} rounded-circle`}
                >
                  {cartQty}
                </Badge>
              ) : (
                ""
              )}
            </Link>
            <DropdownUser logout={logout} id={state.user.user.id} />
          </div>
        ) : state.role === "partner" ? (
          <div className={navButton}>
            <DropdownPartner logout={logout} id={state.user.user.id} />
          </div>
        ) : (
          <div className={navButton}>
            <AuthModal />
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavbarComponent;
