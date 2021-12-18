import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";

import { API } from "../config/api";

// import Component
import NavbarComponent from "../components/Navbar";
import MapPage from "../components/MapPage";
import CartMapPage from "./CartMapPage";

// import styles
import styles from "./CartPage.module.css";

// import assets
import locMark from "../assets/location.png";
import mapCart from "../assets/mapCart.png";
import trashIcon from "../assets/trash.png";

import { CartContext } from "../context/cartContext";

const orderIdFromLocal = JSON.parse(
  localStorage.getItem("transactionId") || "[]"
);

const CartPage = () => {
  // get transaction id
  const [transactionId] = useState(orderIdFromLocal);
  const [statusOrder, setStatusOrder] = useState("");

  // cart
  const [cart, cartDispatch] = useContext(CartContext);
  const cartProducts = cart.cartItems;

  // calculate qty price
  const cartQty = cartProducts.reduce(
    (acc, item) => acc + parseInt(item.qty),
    0
  );
  const itemPrice = cartProducts.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = 20000;
  const subtotal = itemPrice + shippingPrice;

  // get partner name
  const [partnerName, setPartnerName] = useState("");

  const getPartnerName = async () => {
    const name = await API.get(`user/${cart.partnerId}`);
    setPartnerName(name.data.data.user.fullname);
  };

  // function increment
  const incrementCartItem = (cartProducts) => {
    const itemExist = cart.cartItems.find(
      (item) => item.id === cartProducts.id
    );
    if (itemExist && cart.isCheckout === false) {
      cartDispatch({
        type: "CART_ADD_ITEM",
        payload: {
          id: cart.partnerId,
          items: cart.cartItems.map((item) =>
            item.id === cartProducts.id
              ? { ...itemExist, qty: itemExist.qty + 1 }
              : item
          ),
          isCheckout: false,
        },
      });
    } else {
      alert("Plese wait until your previous order finished...");
    }
  };

  // function decrement
  const decrementCartItem = (cartProducts) => {
    const exist = cart.cartItems.find((item) => item.id === cartProducts.id);

    if (cart.isCheckout === false) {
      if (exist.qty === 1) {
        cartDispatch({
          type: "CART_REMOVE_ITEM",
          payload: {
            id: cart.partnerId,
            items: cart.cartItems.filter((item) => item.id !== cartProducts.id),
            isCheckout: false,
          },
        });
      } else {
        cartDispatch({
          type: "CART_REMOVE_ITEM",
          payload: {
            id: cart.partnerId,
            items: cart.cartItems.map((item) =>
              item.id === cartProducts.id
                ? { ...exist, qty: exist.qty - 1 }
                : item
            ),
            isCheckout: false,
          },
        });
      }
    } else {
      alert("Plese wait until your previous order finished...");
    }
  };

  // function remove item
  const removeItem = (cartProducts) => {
    const exist = cart.cartItems.find((item) => item.id === cartProducts.id);

    if (exist && cart.isCheckout === false) {
      cartDispatch({
        type: "CART_REMOVE_ITEM",
        payload: {
          id: cart.partnerId,
          items: cart.cartItems.filter((item) => item.id !== cartProducts.id),
          isCheckout: false,
        },
      });
    } else {
      alert("Plese wait until your previous order finished...");
    }
  };

  // insert order to server
  const handleOrderButton = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    // set format post request
    let orderItems = cartProducts.map((item) => {
      return {
        id: item.id,
        qty: item.qty,
      };
    });

    const body = { products: orderItems, subtotal };

    const createOrder = await API.post("/transaction", body, config);
    if (createOrder.status === 200) {
      cartDispatch({
        type: "CART_ADD_ITEM",
        payload: {
          id: cart.partnerId,
          items: cart.cartItems,
          isCheckout: true,
        },
      });

      localStorage.setItem(
        "transactionId",
        JSON.stringify(createOrder.data.data.transaction.id)
      );
    }

    console.log(createOrder);
  };

  // get status order
  const getStatusOrder = async () => {
    const response = await API.get(`my-transaction/${transactionId}`);

    setStatusOrder(response.data.data.transaction.status);
  };

  // handle finish order to success
  const handleFinishOrder = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = { status: "Success" };

    const response = await API.patch(
      `transaction/${transactionId}`,
      body,
      config
    );

    console.log(response);

    if (response.status === 200) {
      cartDispatch({
        type: "CART_CHECKOUT_SUCCESS",
      });
    }
  };

  // state for modal popup
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSelectLoc, setShowSelectLoc] = useState(false);

  useEffect(() => {
    getStatusOrder();

    if (cart.cartItems.length !== 0) {
      getPartnerName();
    }
  }, []);

  return (
    <>
      <NavbarComponent />

      <Container fluid className={`${styles.mainContent}`}>
        <Container className={`${styles.cartWrapper} pt-5`}>
          {/* ------------------title & select Location --start----------------------- */}
          <Row>
            <h2 className={`${styles.cartTitle} fntAbhaya`}>{partnerName}</h2>

            <Form className="mt-4 mb-4">
              <Row className="align-items-center">
                <Col className={`${styles.formInput} fntMontserrat`} sm={9}>
                  <Form.Label htmlFor="inlineFormInput">
                    Delivery Location
                  </Form.Label>
                  <Form.Control className="mb-2" id="inlineFormInput" />
                </Col>

                <Col sm={3}>
                  <Button
                    variant="warning"
                    type="button"
                    onClick={() => setShowSelectLoc(true)}
                    className="btn btn-search w-100 mt-4 me-5"
                  >
                    Select On Map
                    <img className="mb-1 ps-2" src={mapCart} alt="map" />
                  </Button>

                  <Modal
                    show={showSelectLoc}
                    onHide={() => setShowSelectLoc(false)}
                    dialogClassName={`modal-90w p-2 ${styles.modal}`}
                    aria-labelledby="example-custom-modal-styling-title"
                  >
                    <CartMapPage hideModal={() => setShowSelectLoc(false)} />
                  </Modal>
                </Col>
              </Row>
            </Form>
          </Row>

          {/* ------------------title & select Location --end----------------------- */}

          {/* -------------------Cart items ------------start----------------------- */}

          <Row>
            <Row>
              <Col className="fntMontserrat" sm={8}>
                Review Your Order
              </Col>
            </Row>

            {cart.cartItems.length === 0 ? (
              <div className={`${styles.cartEmpty} fntAbhaya`}>
                <h1>Your cart is empty...</h1>
              </div>
            ) : (
              <Col sm={8}>
                <hr />

                {cartProducts.map((cartProduct) => (
                  <div key={cartProduct.id}>
                    <Row className="mb-0">
                      <Col className={styles.orderImage} sm={3}>
                        <img
                          className={styles.imgCart}
                          src={cartProduct.image}
                          alt="product"
                        />
                      </Col>
                      <Col sm={3}>
                        <p className="mt-3 fntAbhaya">{cartProduct.title}</p>
                        <div className={styles.buttonCartWrapper}>
                          <div>
                            <button
                              onClick={() => decrementCartItem(cartProduct)}
                              className={styles.buttonCartMinus}
                            >
                              -
                            </button>
                          </div>
                          <div className={styles.itemQty}>
                            {cartProduct.qty}
                          </div>
                          <div>
                            <button
                              onClick={() => incrementCartItem(cartProduct)}
                              className={styles.buttonCartPlus}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </Col>
                      <Col sm={3}></Col>

                      <div className={`${styles.orderValue} col-sm-3`}>
                        <p className="mt-3 fntRed">Rp. {cartProduct.price}</p>
                        <button
                          className={styles.buttonTrash}
                          onClick={() => removeItem(cartProduct)}
                        >
                          <img src={trashIcon} alt="delete" />
                        </button>
                      </div>
                    </Row>
                    <hr />
                  </div>
                ))}
              </Col>
            )}

            {/* -------------------Cart items ------------end----------------------- */}

            {/* --------------------Subtotal-------------- */}

            {cart.cartItems.length === 0 ? (
              <div></div>
            ) : (
              <Col sm={4}>
                <hr />
                <div className={`${styles.subtotal} fntMontserrat`}>
                  <div>
                    <p>Subtotal</p>
                    <p>Qty</p>
                    <p>Ongkir</p>
                  </div>

                  <div className={styles.subtotalValue}>
                    <p className="fntRed">Rp. {itemPrice}</p>
                    <p>{cartQty}</p>
                    <p className="fntRed">Rp. {shippingPrice}</p>
                  </div>
                </div>
                <hr />
                <div className={styles.subtotal}>
                  <div>
                    <b>
                      <p className="fntRed">Total</p>
                    </b>
                  </div>
                  <div className="value">
                    <b>
                      <p className="fntRed">Rp. {subtotal}</p>
                    </b>
                  </div>
                </div>

                {/* --------------Modal Map Checkout--start------------------------------ */}
                {cart.isCheckout === true ? (
                  <Button
                    variant="warning"
                    type="submit"
                    className={`btn w-75 mt-5 ms-5 ${styles.btnOrder}`}
                    onClick={() => setShowCheckout(true)}
                  >
                    See How Far ?
                  </Button>
                ) : (
                  <Button
                    variant="warning"
                    type="submit"
                    className={`btn w-75 mt-5 ms-5 ${styles.btnOrder}`}
                    onClick={handleOrderButton}
                  >
                    Order
                  </Button>
                )}

                <Modal
                  show={showCheckout}
                  onHide={() => setShowCheckout(false)}
                  dialogClassName={`modal-90w p-2 ${styles.modal}`}
                  aria-labelledby="example-custom-modal-styling-title"
                >
                  <MapPage />

                  <div className={styles.boxForm}>
                    {statusOrder === "On the way" ? (
                      <b>
                        <h5 className={`${styles.title} mb-3 fntMontserrat`}>
                          Driver is on the way
                        </h5>
                      </b>
                    ) : (
                      <b>
                        <h5 className={`${styles.title} mb-3 fntMontserrat`}>
                          Waiting for transaction approved
                        </h5>
                      </b>
                    )}

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
                            Jl. Elang IV No.48, Sawah Lama, Kec. Ciputat, Kota
                            Tangerang Selatan, Banten 15413
                          </p>
                        </small>
                      </div>
                    </div>
                    <div>
                      <b>
                        <p className="fntMontserrat">Delivery Time</p>
                      </b>
                      <small>
                        <p>10 - 15 Minutes </p>
                      </small>
                    </div>
                    {statusOrder === "On the way" ? (
                      <div>
                        <button
                          className="btn w-100"
                          onClick={handleFinishOrder}
                        >
                          Finished Order
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Modal>
                {/* ------------------Modal Map Checkout--end---------------------------- */}
              </Col>
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default CartPage;
