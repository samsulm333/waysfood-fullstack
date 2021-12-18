import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { API } from "../config/api";

// import component
import NavbarComponent from "../components/Navbar";

// import style
import styles from "./HomePage.module.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

// import assets
import banner from "../assets/banner.png";
import pop1 from "../assets/popular-resto.png";
import jco from "../assets/1200px-J.CO_logo_circle 1.png";
import starbucs from "../assets/starbucks-logo-1 1.png";
import phd from "../assets/Pizza-Hut.png";

const HomePage = () => {
  const [partners, setPartners] = useState([]);
  const [populars, setPopulars] = useState([
    { name: "Burger King", image: pop1 },
    { name: "Starbucks", image: starbucs },
    { name: "J.CO Donuts", image: jco },
    { name: "Pizza Hut", image: phd },
  ]);

  const getResto = async () => {
    const response = await API.get("/users-partner");
    setPartners(response.data.data.users);
  };

  useEffect(() => {
    getResto();
  }, []);

  return (
    <>
      <NavbarComponent />

      <Container fluid className={styles.containerBanner}>
        <Container>
          <Row>
            <Col xl={1}></Col>
            <Col xl={6}>
              <h1 className={styles.bannerText}>Are You Hungry ?</h1>
              <h1 className={styles.bannerText}>Express Home Delivery</h1>
              <Row>
                <Col xl={3}>
                  <hr></hr>
                </Col>
                <Col>
                  <p className={styles.textBanner}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s.
                  </p>
                </Col>
              </Row>
            </Col>

            <Col xl={5}>
              <img className={styles.img} src={banner} alt="banner" />
            </Col>
          </Row>
        </Container>
      </Container>

      <Container fluid className={styles.mainContent}>
        <Container>
          <Row>
            <h2 className="mb-4 mt-5 fntAbhaya">Popular Restaurant</h2>

            {populars.map((popular, index) => {
              return (
                <Card key={index} className={`${styles.popularCard} me-3 p-2`}>
                  <Row>
                    <Col sm={4}>
                      <img
                        className={`${styles.popImage} rounded-circle`}
                        src={popular.image}
                        alt={`pop-${index}`}
                      />
                    </Col>
                    <Col>
                      <h4 className={`${styles.cardText} fntAbhaya`}>
                        {popular.name}
                      </h4>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Row>

          <Row className="mt-5">
            <h2 className="fntAbhaya">Restaurant Near You</h2>

            {partners.map((partner) => (
              <Card key={partner.id} className={`${styles.card} mt-3 me-3 p-2`}>
                <Link to={`/menu/${partner.id}`} className={styles.link}>
                  <Card.Img
                    variant="top"
                    src={partner.image}
                    className={styles.partnerImage}
                  />
                  <Card.Body>
                    <Card.Title className="fntAbhaya">
                      {partner.fullname}
                    </Card.Title>
                    <Card.Text className="fntMontserrat">0.2 KM</Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            ))}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default HomePage;
