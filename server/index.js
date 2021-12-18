require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./src/routes");
const app = express();

app.use(express.json());
app.use(cors());

const port = 5002;

app.use("/api/v1/", router);
app.use("/uploads", express.static("assets"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
