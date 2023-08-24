const db = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utils/jwtGenerator");
// Create a new user with post request

const createUser = async (data) => {
  try {
    const existingUser = await db.any(
      "SELECT * FROM users WHERE username = $1",
      [data.username]
    );

    if (existingUser.length > 0) {
      return { error: "User already exists" };
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(data.password_hash, salt);

    const newUser = await db.one(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [data.username, bcryptPassword]
    );

    const jwtToken = jwtGenerator(newUser.id);

    return { newUser, jwtToken };
  } catch (e) {
    return { error: "Error creating user" };
  }
};

// get user by name and passord(credentials)
const getUserByCredentials = async (username, inputPassword) => {
  try {
    const user = await db.one("SELECT * FROM users WHERE username = $1 ", [
      username,
    ]);

    if (!user) {
      return { error: "invalid credentials" };
    }

    console.log("Input password:", inputPassword);
    console.log("Database password hash:", user.password_hash);
    const validPassword = await bcrypt.compare(
      inputPassword,
      user.password_hash
    );

    if (!validPassword) {
      return { error: "invalid credentials" };
    }
    const jwtToken = jwtGenerator(user.id);

    return { user, jwtToken };
  } catch (e) {
    console.log(e);
    throw e;
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
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password_hash, salt);

    const updated = await db.any(
      `UPDATE users SET username = $1, password_hash = $2  WHERE id = $3 RETURNING *`,
      [username, bcryptPassword, id]
    );
    const jwtToken = jwtGenerator(updated.id);
    console.log(updated);
    return { updated, jwtToken };
  } catch (error) {
    return { error: "Error creating user" };
  }
};

// delete
const deleteUser = async (id) => {
  try {
    const delefromCart = await db.any(
      "DELETE FROM orders WHERE users_id = $1 RETURNING *",
      [id]
    );

    const deleteProduct = await db.any(
      "DELETE FROM orders WHERE product_id = $1 RETURNING *",
      [id]
    );

    const deletedUser = await db.any("DELETE FROM users WHERE id = $1 ", [id]);

    const order = await db.none(
      `
      DELETE FROM orders
      WHERE id = $1;
    `,
      [id]
    );

    return {
      user: deletedUser[0],
      product: deleteProduct[0],
      userincart: delefromCart,
      order: order,
    };
  } catch (e) {
    console.log(e);
  }
};

// add products to cart
const addToCart = async (users_id, product_id) => {
  try {
    let product;

    const productCheck = await db.oneOrNone(
      "SELECT * FROM orders WHERE users_id = $1 AND product_id = $2",
      [users_id, product_id]
    );

    if (productCheck) {
      product = await db.one(
        "UPDATE orders SET quantity = quantity + 1 WHERE users_id = $1 AND product_id = $2 RETURNING *",
        [users_id, product_id]
      );
    } else {
      product = await db.one(
        "INSERT INTO orders (users_id, product_id,quantity) VALUES ($1, $2,1) RETURNING *",
        [users_id, product_id]
      );
    }

    return product;
  } catch (e) {
    console.error("Error:", e);
    throw e; // Rethrow the error to propagate it further if needed
  }
};
// get orders by user

const getOrders = async (id) => {
  try {
    const orders = await db.any(
      `
      SELECT
        o.id AS order_id,
        u.username AS user_username,
        p.name AS product_name,
        p.price AS product_price,
        o.quantity AS order_quantity
      FROM
        orders o
      JOIN
        users u ON o.users_id = u.id
      JOIN
        products p ON o.product_id = p.id
      WHERE
        u.id = $1
      `,
      [id]
    );
    return orders;
  } catch (error) {
    console.error("Error getting orders");
    throw error;
  }
};
// delete products from car

const deleteOrder = async (id) => {
  try {
    const order = await db.none(
      `
      DELETE FROM orders
      WHERE id = $1;
    `,
      [id]
    );
    console.log(order);
    return order;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByCredentials,
  deleteUser,
  addToCart,
  getOrders,
  deleteOrder,
};
