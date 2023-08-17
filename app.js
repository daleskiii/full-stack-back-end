// imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userController = require("./controller/userController");
const productController = require("./controller/productsController");
//dependenacies
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/// controlled routes

app.use("/user", userController);
app.use("/products", productController);

// (default routes)
app.get("/", (req, res) => {
  res.send("Welcome to my Dispensary App");
});

app.get("*", (req, res) => {
  res.status(404).send("Page not found!");
});

module.exports = app;
