const express = require("express");

const router = express.Router();

// Controllers
// import register controller
const { register, login, checkAuth } = require("../controllers/auth");

const {
  getUsers,
  getUserById,
  updateuser,
  deleteUser,
  getUserPartner,
} = require("../controllers/user");

const {
  addProduct,
  getProducts,
  getProductByUser,
  getDetailproduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product");

const {
  addTransaction,
  getPartnerTransaction,
  getDetailTransaction,
  getUserTransaction,
  getDetailTransactionByUser,
  editTransaction,
  deleteTransaction,
} = require("../controllers/transaction");

const { auth } = require("../../middlewares/auth");

const { uploadFile } = require("../../middlewares/uploadFile");

// Route
// User Routes
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.get("/users", getUsers);
router.get("/users-partner", getUserPartner);
router.get("/user/:id", getUserById);
router.patch("/user/:id", uploadFile("image"), updateuser);
router.delete("/user/:id", deleteUser);

// Product Routes
router.get("/products", auth, getProducts);
router.get("/products/:id", auth, getProductByUser);
router.get("/product/:id", auth, getDetailproduct);
router.post("/product", auth, uploadFile("image"), addProduct);
router.patch("/product/:id", auth, editProduct);
router.delete("/product/:id", auth, deleteProduct);

// Transaction Routes
router.post("/transaction", auth, addTransaction);
router.get("/transaction", auth, getPartnerTransaction);
router.get("/transaction/:id", auth, getDetailTransaction);
router.patch("/transaction/:id", auth, editTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);
router.get("/my-transaction", auth, getUserTransaction);
router.get("/my-transaction/:id", auth, getDetailTransactionByUser);

module.exports = router;
