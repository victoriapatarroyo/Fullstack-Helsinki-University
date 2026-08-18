require("dotenv").config(); // 👈 Siempre en la primera línea

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");

// Conexión a tu única base de datos MONGODB_URI
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB ✅");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB ❌:", error.message);
  });

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/blogs", blogsRouter);

module.exports = app;
