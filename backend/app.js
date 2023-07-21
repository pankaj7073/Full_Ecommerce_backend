const express = require("express");
const app = express();
const cookiParser = require("cookie-parser");
// error.js
const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookiParser());

// Routes Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use(product);
app.use(user);
app.use(order);

// middleware for Errors
app.use(errorMiddleware);

module.exports = app;

// 2:56:17
