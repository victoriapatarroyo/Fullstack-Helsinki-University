const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// GET usando async/await
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// POST usando async/await
blogsRouter.post("/", async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

//DELETE usando async/await
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

//PUT usando async/await
blogsRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    returnDocument: "after",
  });

  response.json(blog);
});

module.exports = blogsRouter;
