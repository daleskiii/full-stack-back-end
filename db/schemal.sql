DROP DATABASE IF EXISTS  dispensary_dev;

CREATE DATABASE dispensary_dev;

\c dispensary_dev;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL
   );

DROP TABLE IF EXISTS products;

CREATE TABLE products  (

id SERIAL PRIMARY KEY,
name VARCHAR(100),
  category  VARCHAR(100),
  description TEXT,
  thc_content DECIMAL(5,2),
  cbd_content BOOLEAN,
  price INTEGER,
  image_URL VARCHAR(255)
);


DROP TABLE IF EXISTS orders;

CREATE TABLE orders (

id SERIAL PRIMARY KEY,

users_id INTEGER REFERENCES users(id),

product_id INTEGER REFERENCES products(id),

quantity INTEGER
);
