//imports
const express = require("express");
const product = express();
const { getAllProducts, getProductByID } = require("../queries/products");

//routes
// get all products route

product.get("/", async (req, res) => {
  try {
    const allProducts = await getAllProducts();

    if (allProducts.length === 0) {
      res.status(404).json({ error: "No products found" });
    } else {
      res.status(201).json(allProducts);
    }
  } catch (e) {
    console.log(e);
    return e.message;
  }
});

//get prodducts by id route

product.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductByID(id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "No Products found by this id" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = product;
