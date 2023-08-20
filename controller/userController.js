const express = require("express");
const user = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByCredentials,
  deleteUser,
  addToCart,
  getOrders,
  deleteOrder,
} = require("../queries/users");
/// create user
user.post("/", async (req, res) => {
  try {
    const createdUser = await createUser(req.body);

    res.status(201).json(createdUser);
  } catch (e) {
    console.log(e);
    return e.message;
  }
});
// get user
user.get("/", async (req, res) => {
  const allUsers = await getAllUsers();

  if (allUsers.length === 0) {
    res.status(404).json({ error: "No users found" });
  } else {
    res.status(200).json(allUsers);
  }
});
// GEt by id

user.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE user
user.put("/:id", async (req, res) => {
  const updated = await updateUserById(req.params.id, req.body);
  console.log(updated);
  if (updated.length === 0) {
    res.status(404).json({ message: "not found!" });
  } else {
    res.status(200).json(updated);
  }
});

//get user by credentials

user.post("/login", async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const user = await getUserByCredentials(username, password_hash);

    if (user.jwtToken) {
      res.status(200).json(user);
      console.log(user.jwtToken);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Delete!!
user.delete("/:id", async (req, res) => {
  const deletedUser = await deleteUser(req.params.id);

  return res.json(deletedUser);
});
/// post into cart

user.post("/:id/orders", async (req, res) => {
  const { user_id } = req.body;
  const { product_id } = req.body;
  try {
    await addToCart(user_id, product_id);
    res.status(201).json({ message: "product was added" });
  } catch (e) {
    console.log(e);
  }
});
/// get orders by id

user.get("/orders/:id", async (req, res) => {
  try {
    const orders = await getOrders(req.params.id);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error gttting orders" });
  }
});
//delete product by id

user.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await deleteOrder(id);
    res.status(200).json({ message: order });
  } catch (error) {
    res.status(500).json({ error: "Error deleting order" });
  }
});

module.exports = user;
