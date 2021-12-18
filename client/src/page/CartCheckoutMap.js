import { useState } from "react";

import { Modal, Button } from "react-bootstrap";
import MapPage from "../components/MapPage";

import styles from "./CartCheckoutmap.module.css";
import locMark from "../assets/location.png";

const CartCheckoutMap = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        variant="warning"
        type="submit"
        className="btn btn-order w-75 mt-5 ms-5"
        onClick={() => setShow(true)}>
        Order
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName={`modal-90w p-2 ${styles.modal}`}
        aria-labelledby="example-custom-modal-styling-title">
        <MapPage />
        <div className={styles.boxForm}>
          <h2 className="mb-3">Select delivery location</h2>
          <div className="d-flex">
            <div className="ms-3 me-4">
              <img src={locMark} alt="location-mark" />
            </div>
            <div>
              <h5>Harbour Building</h5>
              <p>
                Jl. Elang IV No.48, Sawah Lama, Kec. Ciputat, Kota Tangerang
                Selatan, Banten 15413
              </p>
            </div>
          </div>
          <div>
            <button className="btn w-100">Confirm Location</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CartCheckoutMap;
