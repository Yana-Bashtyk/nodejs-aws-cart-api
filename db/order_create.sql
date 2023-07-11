CREATE TYPE order_status AS ENUM ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  cart_id VARCHAR(255),
  payment JSON,
  delivery JSON,
  comments TEXT,
  status order_status,
  total NUMERIC,
  FOREIGN KEY (cart_id) REFERENCES carts(id)
);