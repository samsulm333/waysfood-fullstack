import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Modal } from "react-bootstrap";

import { API } from "../config/api";

import styles from "./EditProfile.module.css";

import mapCart from "../assets/mapCart.png";

import NavbarComponent from "../components/Navbar";
import ProfileMap from "./ProfileMap";

const EditProfile = ({ hide }) => {
  const [showSelectLoc, setShowSelectLoc] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    location: "",
    image: "",
  });

  console.log(form);

  const [preview, setPreview] = useState(null);

  let navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    location: "",
    image: "",
  });
  const { id } = useParams();

  const getUserById = async () => {
    const response = await API.get(`user/${id}`);
    setUser(response.data.data.user);
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.set("fullname", user.fullname);
      formData.set("email", user.email);
      formData.set("phone", user.phone);
      formData.set("location", user.location);
      formData.set("image", user.image[0], user.image[0].name);

      const response = await API.patch(`user/${id}`, formData, config);

      console.log(formData.get("image"));
      if (response.status === 200) {
        navigate(`/profile-user/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);
  console.log(user);

  return (
    <>
      <NavbarComponent />

      <Container fluid className="mainContent">
        <Container className="pt-5">
          <h2 className="ms-3 mb-5 fntAbhaya">
            Edit Profile {user.role === "partner" ? "Partner" : " "}
          </h2>
          <form method="post" onSubmit={handleSubmit}>
            <div className="mb-3 d-flex">
              <div className="w-75 me-2">
                <input
                  type="text"
                  placeholder={
                    user.role === "partner"
                      ? `Name Partner  :  ${user.fullname}`
                      : `Full Name  :  ${user.fullname}`
                  }
                  className={`title form-control ${styles.input}`}
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                />
              </div>

              <div className="w-25 d-flex">
                <input
                  type="file"
                  placeholder="Attach Image"
                  className={`${styles.attachImage} form-control ${styles.input} `}
                  name="image"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <input
                type="email"
                placeholder={`Email  :  ${user.email}`}
                className={`price form-control ${styles.input}`}
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <input
                type="phone"
                placeholder={`Phone Number  :  ${user.phone}`}
                className={`price form-control ${styles.input}`}
                name="phone"
                value={user.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 d-flex">
              <div className="w-75 me-2">
                <input
                  type="text"
                  placeholder={
                    user.location === null
                      ? "Location  : Unset (Please select your location on Map button)"
                      : `Location  :  ${user.location}`
                  }
                  className={`title form-control ${styles.input}`}
                  name="location"
                  value={user.location}
                  onChange={handleChange}
                />
              </div>
              <div className="w-25 d-flex">
                <button
                  type="button"
                  onClick={() => setShowSelectLoc(true)}
                  className="btn w-100 me-0 mt-0"
                >
                  Select On Map
                  <img className="mb-1 ps-2" src={mapCart} alt="map" />
                </button>

                <Modal
                  show={showSelectLoc}
                  onHide={() => setShowSelectLoc(false)}
                  dialogClassName={`modal-90w p-2 ${styles.modal}`}
                  aria-labelledby="example-custom-modal-styling-title"
                >
                  <ProfileMap hide={() => setShowSelectLoc(false)} />
                </Modal>
              </div>
            </div>

            <div className="d-flex flex-row-reverse mt-5">
              <button type="submit" className="btn w-25 me-0 mt-5">
                Save
              </button>
            </div>
          </form>
        </Container>
      </Container>
    </>
  );
};

export default EditProfile;
