const db = require("../db/dbconfig");

// Create a new user with post request

const createUser = async (data) => {
  try {
    const newUser = await db.one(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [data.username, data.password_hash]
    );
    return newUser;
  } catch (e) {
    return e;
  }
};
// get all users
const getAllUsers = async () => {
  try {
    const allUsers = await db.any("SELECT * FROM users");
    return allUsers;
  } catch (error) {
    return error;
  }
};

// get user by id

const getUserById = async (userId) => {
  try {
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE id = $1",
      userId
    );
    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// update users by id
const updateUserById = async (id, data) => {
  const { username, password_hash } = data;
  try {
    const updated = await db.any(
      `UPDATE users SET username = $1, password_hash = $2  WHERE id = $3 RETURNING *`,
      [username, password_hash, id]
    );

    return updated;
  } catch (error) {
    return error;
  }
};

// get user by name and passord(credentials)
const getUserByCredentials = async (userName, password_hash) => {
  try {
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE userName = $1 AND password_hash = $2 LIMIT 1",
      [userName, password_hash]
    );
    console.log(user);
    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// delete
const deleteUser = async (id) => {
  try {
    await db.any("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByCredentials,
  deleteUser,
};
