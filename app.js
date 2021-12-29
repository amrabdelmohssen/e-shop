const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors')
const authJwt = require('./helpers/auth-jwt')
const errorHander = require('./helpers/error-handle')
// Environment variables
require("dotenv/config");

const api = process.env.API_URL;

//routers
const productRouter = require('./routers/product')
const categoryRouter = require('./routers/category')
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')
//middlewares
app.use('/public/uploads' , express.static(__dirname + '/public/uploads'))
app.use(cors())
app.options('*',cors())
app.use(authJwt())

// parse json object
app.use(express.json());

app.use(morgan("tiny"));
app.use(errorHander)
// make schema
// post
// get

app.use(`${api}/products`,productRouter)
app.use(`${api}/categories`,categoryRouter)
app.use(`${api}/users`,userRouter)
app.use(`${api}/orders`,orderRouter)

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("database connection is ready...");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
  const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("server is running http://localhost:3000");
});
