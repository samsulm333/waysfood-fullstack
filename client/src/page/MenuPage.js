import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Card, Button } from "react-bootstrap";

import { CartContext } from "../context/cartContext";
import { API } from "../config/api";

// import component
import NavbarComponent from "../components/Navbar";

// import style
import styles from "./MenuPage.module.css";

const MenuPage = () => {
  const { id } = useParams();
  const [cart, cartDispatch] = useContext(CartContext);
  const [partner, setPartner] = useState({});
  const [menus, setMenus] = useState([]);

  const AddToCart = (menu) => {
    const itemExist = cart.cartItems.find((item) => item.id === menu.id);
    if (cart.isCheckout === false) {
      if (itemExist) {
        cartDispatch({
          type: "CART_ADD_ITEM",
          payload: {
            id: id,
            items: cart.cartItems.map((item) =>
              item.id === menu.id
                ? { ...itemExist, qty: itemExist.qty + 1 }
                : item
            ),
            isCheckout: false,
          },
        });
        return;
      } else {
        cartDispatch({
          type: "CART_ADD_ITEM",
          payload: {
            id: id,
            items: [...cart.cartItems, { ...menu, qty: 1 }],
            isCheckout: false,
          },
        });
        return;
      }
    } else {
      alert("Plese wait until your previous order finished...");
    }
  };

  const getMenu = async () => {
    const response = await API.get(`products/${id}`);
    setPartner(response.data.data.userPartner);
    setMenus(response.data.data.products);
  };

  useEffect(() => {
    console.log(cart);
    getMenu();
  }, []);

  return (
    <>
      <NavbarComponent />

      <Container fluid className={styles.mainContent}>
        <Container className="pt-5">
          <Row>
            <h2 className="fntAbhaya">{partner.fullname}, Menus</h2>

            {menus.map((menu) => (
              <Card key={menu.id} className={`${styles.card} mt-3 me-3 p-2`}>
                <Card.Img
                  variant="top"
                  src={menu.image}
                  className={styles.menuImage}
                />
                <Card.Body className={styles.cardBody}>
                  <Card.Title className={`${styles.cardTitle} fntAbhaya`}>
                    {menu.title}
                  </Card.Title>
                  <Card.Text className={`${styles.price} fntMontserrat`}>
                    Rp. {menu.price}
                  </Card.Text>
                  <Button
                    variant="warning"
                    className={`${styles.cardButton} w-100`}
                    onClick={() => AddToCart(menu)}
                  >
                    Order
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default MenuPage;
