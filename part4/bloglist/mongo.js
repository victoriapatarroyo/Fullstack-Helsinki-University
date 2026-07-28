require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("./models/blog");

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl);

const blog = new Blog({
  title: "Primer blog",
  author: "Vicky",
  url: "http://miblog.com",
  likes: 0,
});

blog.save().then((result) => {
  console.log("Blog guardado:", result);
  mongoose.connection.close();
});
