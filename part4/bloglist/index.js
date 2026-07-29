require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const mongoUrl = process.env.MONGODB_URI;

// Log para verificación de conexión
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB ✅");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB ❌:", error.message);
  });

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
