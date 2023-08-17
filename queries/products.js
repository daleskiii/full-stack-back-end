const db = require("../db/dbconfig");

//Get all products

const getAllProducts = async () => {
  try {
    const allProducts = await db.any("SELECT * FROM products");
    return allProducts;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

const getProductByID = async (id) => {
  try {
    const product = await db.oneOrNone("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return product;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getAllProducts,
  getProductByID,
};
