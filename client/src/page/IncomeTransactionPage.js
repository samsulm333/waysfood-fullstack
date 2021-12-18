import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import { API } from "../config/api";

// import component
import NavbarComponent from "../components/Navbar";

// import styles
import "./IncomeTransaction.css";

// import assets
import checklist from "../assets/checklist.png";
import cancel from "../assets/cancel.png";

const IncomeTransactionPage = () => {
  const [transaction, setTransaction] = useState([]);

  const getTransaction = async () => {
    const responseData = await API.get("/transaction");
    setTransaction(responseData.data.data.transaction);
  };

  const handleButtonApprove = async (order) => {
    const id = order.id;

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = { status: "On the way" };
    await API.patch(`transaction/${id}`, body, config);
  };

  const handleButtonCancel = async (order) => {
    const id = order.id;

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = { status: "Canceled" };
    await API.patch(`transaction/${id}`, body, config);
  };

  useEffect(() => {
    getTransaction();
  }, []);

  console.log(transaction);
  return (
    <>
      <NavbarComponent />

      <Container fluid className="mainContent">
        <Container className="pt-5">
          <h2 className="ms-3 mb-5 fntAbhaya">Income Transaction</h2>
          <table>
            <tr className="tableHead">
              <th>No</th>
              <th>Name</th>
              <th>Address</th>
              <th>Product</th>
              <th>Status</th>
              <th className="action">Action</th>
            </tr>

            {transaction.length === 0 ? (
              <tr>
                <td>Your Transaction is empty</td>
              </tr>
            ) : (
              transaction.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.userOrder.fullname}</td>
                  <td>{item.userOrder.location}</td>
                  <td>
                    {item.order.map((order) => (
                      <ul>
                        <li>
                          {order.title} x{order.qty}pcs
                        </li>
                      </ul>
                    ))}
                  </td>
                  <td>{item.status}</td>
                  <td className="action">
                    {item.status === "Success" ? (
                      <img src={checklist} alt="cancel" />
                    ) : item.status === "On the way" ? (
                      <button className="btn-success" disabled>
                        On the way
                      </button>
                    ) : item.status === "Canceled" ? (
                      <img src={cancel} alt="cancel" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleButtonCancel(item)}
                          className="btn-danger"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleButtonApprove(item)}
                          className="btn-success"
                        >
                          Approove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </table>
        </Container>
      </Container>
    </>
  );
};

export default IncomeTransactionPage;
