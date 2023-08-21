# Dispensary App - Backend

The backend of the application is built using Node.js and Express.js. It provides RESTful routes to manage users, products, and orders. Key features include:

## User Management Routes

- **POST /user:** Create a new user with a username and password.
- **GET /user/:id:** Get user details by user ID.
- **PUT /user/:id:** Update user information (username and password).
- **DELETE /user/:id:** Delete a user account.

## Product Routes

- **GET /products:** Retrieve a list of all available products.
- **GET /products/:id:** Get detailed information about a specific product by ID.

## Order Routes

- **POST /orders:** Place an order by associating user and product IDs.
- **GET /orders/:userId:** Retrieve order history for a specific user.

## Technologies Used

- Backend: Node.js, Express.js, PostgreSQL

## Future Enhancements

- User authentication and security enhancements.
