const express = require("express");
const user = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByCredentials,
  deleteUser,
} = require("../queries/users");
/// create user
user.post("/", async (req, res) => {
  try {
    const createdUser = await createUser(req.body);

    res.status(201).json(createdUser);
    console.log(createdUser);
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
  const id = req.params.id;
  const { username, password_hash } = req.body;

  try {
    const updatedUser = await updateUserById(id, {
      username,
      password_hash,
    });

    if (updatedUser.length > 0) {
      res.status(200).json(updatedUser[0]); // Return the updated user object
    } else {
      res.status(404).json({ message: "User not found" });
    }
    console.log(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get user by credentials

user.post("/login", async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const user = await getUserByCredentials(username, password_hash);

    if (user) {
      res.status(200).json(user);
      console.log(user);
    } else {
      res.status(404).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Delete!!

user.delete("/:id", async (req, res) => {
  const deletedUser = await deleteUser(req.params.id);

  if (deletedUser.length === 0) {
    return res.status(404).json({ message: "No data found!", error: true });
  } else {
    res.json(deletedUser[0]);
  }
});

module.exports = user;
