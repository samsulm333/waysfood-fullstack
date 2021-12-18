import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import { UserContext } from "../../context/userContext";

import { API } from "../../config/api";
import "./AuthModal.css";

const AuthModal = () => {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState(null);

  console.log(state);

  // -------------Login function----------
  const [loginModal, setLoginModal] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const closeLoginModal = () => setLoginModal(false);
  const showLoginModal = () => setLoginModal(true);
  const moveToLoginModal = () => {
    setRegisterModal(false);
    setLoginModal(true);
  };

  const handleChangeLogin = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitLogin = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(loginForm);

      const response = await API.post("/login", body, config);

      console.log(response.data.data.user);

      // notification
      if (response.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });
        if (response.data.data.user.role === "partner") {
          navigate("/transaction");
        }
      } else {
        const alert = (
          <Alert variant="danger" className="notif">
            Login failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="notif">
          Login error
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  const closeRegisterModal = () => setRegisterModal(false);
  const showRegisterModal = () => setRegisterModal(true);
  const moveToRegisterModal = () => {
    setRegisterModal(true);
    setLoginModal(false);
  };

  // ----------Register Function-------------
  const [registerModal, setRegisterModal] = useState(false);

  const [regisForm, setRegisForm] = useState({
    email: "",
    password: "",
    fullname: "",
    gender: "",
    phone: "",
    role: "",
  });

  const handleChangeRegis = (e) => {
    setRegisForm({
      ...regisForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRegis = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(regisForm);

      const response = await API.post("/register", body, config);

      console.log(response);

      // notification
      if (response.status === 200) {
        const alert = (
          <Alert variant="success" className="notif">
            Register success, Please Login!
          </Alert>
        );
        setMessage(alert);
        moveToLoginModal();
      } else {
        const alert = (
          <Alert variant="danger" className="notif p-0">
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="notif">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  return (
    <>
      {/* --------Login Button--------- */}
      <Button className="button" onClick={showLoginModal}>
        Login
      </Button>

      {/* ------------Login Modal----------- */}
      <Modal
        className="loginModal"
        show={loginModal}
        onHide={closeLoginModal}
        animation={false}
      >
        <h2 className="modalHeader">Login</h2>

        <form className="formModal" onSubmit={handleSubmitLogin}>
          {message && message}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              className="input"
              type="email"
              placeholder="Email"
              value={loginForm.email}
              name="email"
              onChange={handleChangeLogin}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              className="input"
              type="password"
              placeholder="Password"
              name="password"
              value={loginForm.password}
              onChange={handleChangeLogin}
            />
          </Form.Group>

          <Form.Group>
            <button variant="primary" className="input-button">
              Login
            </button>
          </Form.Group>

          <Form.Text className="formText">
            Don't have an account ? Klik
            <Link to="#" className="btnLink" onClick={moveToRegisterModal}>
              Here
            </Link>
          </Form.Text>
        </form>
      </Modal>

      {/* ---------------Register Button---------- */}
      <Button className="button" onClick={showRegisterModal}>
        Register
      </Button>

      {/* --------------Register Modal-------------  */}
      <Modal
        className="registerModal"
        show={registerModal}
        onHide={closeRegisterModal}
        animation={false}
      >
        <h2 className="modalHeader">Register</h2>

        <form className="registerForm" onSubmit={handleSubmitRegis}>
          {message && message}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              className="input"
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChangeRegis}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              className="input"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChangeRegis}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              className="input"
              type="text"
              placeholder="Fullname"
              name="fullname"
              onChange={handleChangeRegis}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <select
              class="input form-select"
              aria-label="Default select example"
              name="gender"
              onChange={handleChangeRegis}
            >
              <option defaultValue>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              className="input"
              type="phone"
              placeholder="Phone"
              name="phone"
              onChange={handleChangeRegis}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <select
              class="input form-select"
              aria-label="Default select example"
              name="role"
              onChange={handleChangeRegis}
            >
              <option defaultValue>As User</option>
              <option value="customer">Customer</option>
              <option value="partner">Partner</option>
            </select>
          </Form.Group>

          <Form.Group>
            <button variant="primary" className="input-button">
              Register
            </button>
          </Form.Group>

          <Form.Text className="formTextRegister">
            Already have an account ? Klik
            <Link to="#" className="btnLink" onClick={moveToLoginModal}>
              Here
            </Link>
          </Form.Text>
        </form>
      </Modal>
    </>
  );
};

export default AuthModal;
