const express = require("express");
const app = express();
const userRouter = require("./Routes/userRoutes");
const poemRouter = require("./Routes/poemRoutes");
const commentRouter = require("./Routes/commentRoutes");

const bodyParser = require("body-parser");

app.use(express.json());
app.use("/api/v1", userRouter);
app.use("/api/v1/poems", poemRouter);

app.use("/api/v1/comments", commentRouter);

module.exports = app;
