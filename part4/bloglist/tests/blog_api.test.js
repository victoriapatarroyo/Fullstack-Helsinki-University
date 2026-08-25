const { test, after } = require("node:test"); // 👈 Agregado 'after'
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose"); // 👈 Agregado 'mongoose'

const app = require("../app");

const api = supertest(app);

test("blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.ok(Array.isArray(response.body));
});

test("the unique identifier property is named id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  assert.notStrictEqual(blog.id, undefined);
});

test("a new blog can be added", async () => {
  const response = await api.get("/api/blogs");
  const blogsAtStart = response.body;

  await api
    .post("/api/blogs")
    .send({
      title: "Testing a new blog",
      author: "Test Author",
      url: "https://example.com",
      likes: 10,
    })
    .expect(201);

  const responseAfter = await api.get("/api/blogs");
  const blogsAfter = responseAfter.body;

  assert.strictEqual(blogsAfter.length, blogsAtStart.length + 1);

  const newBlog = blogsAfter[blogsAfter.length - 1];

  assert.strictEqual(newBlog.title, "Testing a new blog");
});

test("a blog without likes defaults to zero", async () => {
  await api
    .post("/api/blogs")
    .send({
      title: "Blog without likes",
      author: "Test Author",
      url: "https://example.com",
    })
    .expect(201);

  const response = await api.get("/api/blogs");
  const blogs = response.body;
  const newBlog = blogs[blogs.length - 1];

  assert.strictEqual(newBlog.likes, 0);
});

// 👈 Cierra la conexión a la base de datos al finalizar
after(async () => {
  await mongoose.connection.close();
});
