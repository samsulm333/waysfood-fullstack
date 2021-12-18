import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { API } from "../config/api";

// import user from "../assets/Rectangle 12.png";
import logo from "../assets/logo.png";

import NavbarComponent from "../components/Navbar";
import styles from "./UserProfile.module.css";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [userTransaction, setUserTransaction] = useState([]);

  const getUserById = async () => {
    const response = await API.get(`user/${id}`);
    setUser(response.data.data.user);
  };

  const getUserTransaction = async () => {
    const responseData = await API.get("/my-transaction");
    setUserTransaction(responseData.data.data.transaction);
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
              <h2 className="mb-5 fntAbhaya">My Profile</h2>
              <Row>
                <div className={styles.imageWrapper}>
                  <img
                    className={`${styles.image} rounded`}
                    src={user.image}
                    alt="user"
                  />
                </div>
                <div className={styles.profileText}>
                  <p className="mb-5px fntBrown">Full name</p>
                  <p className="mb-5px">{user.fullname}</p>
                  <br />
                  <p className="mb-5px fntBrown">Email</p>
                  <p className="mb-5px">{user.email}</p>
                  <br />
                  <p className="mb-5px fntBrown">Phone</p>
                  <p className="mb-5px">{user.phone}</p>
                </div>
              </Row>
              <Link to={`/edit-profile/${id}`}>
                <Button variant="warning" className={`${styles.btn} mt-4`}>
                  Edit Profile
                </Button>
              </Link>
            </Col>

            <Col lg={5}>
              <h2 className="mb-5 fntAbhaya">History Transaction</h2>

              {userTransaction &&
                userTransaction.map((item) => (
                  <div className={styles.historyTransaction}>
                    <div className={styles.historyDetail}>
                      <b>
                        <small>
                          <p className="mb-5px">{item.seller}</p>
                        </small>
                      </b>

                      <small>
                        <p className="mb-5px">
                          <b>Saturday,</b> 12 March 2021
                        </p>
                      </small>
                      <br />
                      <small>
                        <p className="fntBrown">Total : Rp. {item.subtotal}</p>
                      </small>
                    </div>

                    <div className={styles.historyMark}>
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
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default UserProfilePage;
