import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { API } from "../config/api";

import logo from "../assets/logo.png";

import NavbarComponent from "../components/Navbar";
import styles from "./PartnerProfile.module.css";

const PartnerProfilePage = () => {
  const [user, setUser] = useState({});
  const [partnerOrder, setPartnerOrder] = useState([]);
  const { id } = useParams();

  const getUserById = async () => {
    const response = await API.get(`user/${id}`);
    setUser(response.data.data.user);
  };

  const getUserTransaction = async () => {
    const responseData = await API.get("/transaction");
    setPartnerOrder(responseData.data.data.transaction);
  };
  useEffect(() => {
    getUserById();
    getUserTransaction();
  }, []);

  return (
    <>
      <NavbarComponent />

      <Container fluid className="mainContent">
        <Container className="pt-5">
          <Row>
            <Col lg={7}>
              <h2 className="mb-5 fntAbhaya">Profile Partner</h2>
              <Row>
                <div className={styles.imageWrapper}>
                  <img
                    className={`rounded ${styles.image}`}
                    src={user.image}
                    alt="partner"
                  />
                </div>
                <div className={styles.profileText}>
                  <p className={`${styles.mb5} ${styles.fntBrown}`}>
                    Full name
                  </p>
                  <p className={styles.mb5}>{user.fullname}</p>
                  <br />
                  <p className={`${styles.mb5} ${styles.fntBrown}`}>Email</p>
                  <p className={styles.mb5}>{user.email}</p>
                  <br />
                  <p className={`${styles.mb5} ${styles.fntBrown}`}>Phone</p>
                  <p className={styles.mb5}>{user.phone}</p>
                </div>
              </Row>
              <Link to={`/edit-profile/${id}`}>
                <Button variant="warning" className={`${styles.btn} mt-4`}>
                  Edit Profile
                </Button>
              </Link>
            </Col>

            <Col lg={5}>
              <Link to="/transaction" className="link">
                <h2 className="mb-5 fntAbhaya">History Order</h2>
                {partnerOrder &&
                  partnerOrder.map((item) => (
                    <div className={styles.historyOrder}>
                      <div className={styles.historyDetail}>
                        <b>
                          <small>
                            <p className={styles.mb5}>
                              {item.userOrder.fullname}
                            </p>
                          </small>
                        </b>

                        <small>
                          <p className={styles.mb5}>
                            <b>Saturday,</b> 12 March 2021
                          </p>
                        </small>
                        <br />
                        <small>
                          <p className={styles.fntBrown}>
                            Total : Rp. {item.subtotal}
                          </p>
                        </small>
                      </div>

                      <div className={styles.historymark}>
                        <div className={styles.logoStyle}>
                          <h1 className={styles.logoText}>WaysFood</h1>
                          <img className={styles.img} src={logo} alt="logo" />
                        </div>

                        <div className={styles.doneMark}>
                          <b>
                            <p className={styles.doneText}>{item.status}</p>
                          </b>
                        </div>
                      </div>
                    </div>
                  ))}
              </Link>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default PartnerProfilePage;
