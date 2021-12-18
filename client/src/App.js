import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "mapbox-gl/dist/mapbox-gl.css";

// import style
import "./App.css";

// import Element
import HomePage from "./page/HomePage";
import MenuPage from "./page/MenuPage";
import CartPage from "./page/CartPage";
import UserProfilePage from "./page/UserProfile";

import PartnerProfilePage from "./page/Partnerprofile";
import IncomeTransactionPage from "./page/IncomeTransactionPage";
import AddProductPage from "./page/AddProductPage";
import EditProfile from "./page/EditProfile";

import { API, setAuthToken } from "./config/api";
import { UserContext } from "./context/userContext";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await API.get("/check-auth");

        if (response.status === 404) {
          return dispatch({
            type: "AUTH_ERROR",
          });
        }

        let payload = response.data.data;

        payload.user.token = localStorage.token;

        dispatch({
          type: "USER_SUCCESS",
          payload,
        });
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile-user/:id" element={<UserProfilePage />} />

        <Route path="/profile-partner/:id" element={<PartnerProfilePage />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/transaction" element={<IncomeTransactionPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
