import MapPage from "../components/MapPage";

import PropTypes from "prop-types";

import styles from "./ProfileMap.module.css";
import locMark from "../assets/location.png";

const ProfileMap = ({ hide }) => {
  return (
    <div>
      <MapPage />

      <div className={styles.boxForm}>
        <h5 className="mb-3">Select My location</h5>
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
          <button className="btn w-100" onClick={hide}>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

ProfileMap.propTypes = {
  hide: PropTypes.func,
};

export default ProfileMap;
