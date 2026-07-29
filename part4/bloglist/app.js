const express = require("express");
const app = express();
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/blogs", blogsRouter);

module.exports = app;
