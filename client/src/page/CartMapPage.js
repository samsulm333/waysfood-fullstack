import PropTypes from "prop-types";
import MapPage from "../components/MapPage";

import styles from "./CartMapPage.module.css";
import locMark from "../assets/location.png";

const CartMapPage = ({ hideModal }) => {
  return (
    <div>
      <MapPage />

      <div className={styles.boxForm}>
        <h5 className={`${styles.title} mb-3 fntMontserrat`}>
          Select delivery location
        </h5>
        <div className="d-flex">
          <div className="ms-3 me-4">
            <img src={locMark} alt="location-mark" />
          </div>
          <div>
            <b>
              <p>Harbour Building</p>
            </b>
            <small>
              <p>
                Jl. Elang IV No.48, Sawah Lama, Kec. Ciputat, Kota Tangerang
                Selatan, Banten 15413
              </p>
            </small>
          </div>
        </div>
        <div>
          <button className="btn w-100" onClick={hideModal}>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

CartMapPage.propTypes = {
  hideModal: PropTypes.func,
};

export default CartMapPage;
