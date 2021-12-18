import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { UserContext } from "../context/userContext";

import { API } from "../config/api";

import imgIcon from "../assets/add-product.png";
import styles from "./AddProductPage.module.css";

import NavbarComponent from "../components/Navbar";

const AddProductPage = () => {
  const [state] = useContext(UserContext);

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);

  let navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
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
      formData.set("title", form.title);
      formData.set("price", form.price);
      formData.set("image", form.image[0], form.image[0].name);

      const response = await API.post("/product", formData, config);

      navigate(`/menu/${state.user.user.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <NavbarComponent />

      <Container fluid className="mainContent">
        <Container className="pt-5">
          <h2 className="ms-3 mb-2 fntAbhaya">Add Product</h2>
          <form action="#" method="post" onSubmit={handleSubmit}>
            <div
              className={`${styles.divPrev} d-flex align-items-end flex-column`}
            >
              <div>
                {preview ? (
                  <img
                    src={preview}
                    className={styles.imgPreview}
                    style={{ objectFit: "cover" }}
                    alt="preview"
                  />
                ) : (
                  <img
                    src={imgIcon}
                    className={styles.imgPreview}
                    style={{ objectFit: "contain" }}
                    alt="preview"
                  />
                )}
              </div>
            </div>

            <div className="mb-3 d-flex">
              <div className="w-75 me-2">
                <input
                  type="text"
                  placeholder="Title"
                  className={`title form-control ${styles.input}`}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
              <div className="w-25 d-flex">
                <input
                  type="file"
                  className={`${styles.attachImage} form-control ${styles.inputImage} `}
                  name="image"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <input
                type="number"
                placeholder="Price"
                className={`price form-control ${styles.input}`}
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex flex-row-reverse ">
              <button type="submit" className="btn w-25 me-0">
                Save
              </button>
            </div>
          </form>
        </Container>
      </Container>
    </>
  );
};

export default AddProductPage;
