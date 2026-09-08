const { test, after, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose"); // 👈 Agregado 'mongoose'
const app = require("../app");
const User = require("../models/user");
const api = supertest(app);

before(async () => {
  await User.deleteMany({});
});

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

test("a blog without title or url is not added", async () => {
  await api
    .post("/api/blogs")
    .send({
      author: "Test Author",
      url: "https://example.com",
    })
    .expect(400);

  await api
    .post("/api/blogs")
    .send({
      title: "A blog without URL",
      author: "Test Author",
    })
    .expect(400);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await api.get("/api/blogs");

  const blogToDelete = blogsAtStart.body[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await api.get("/api/blogs");

  assert.strictEqual(
    blogsAtEnd.body.some((blog) => blog.id === blogToDelete.id),
    false,
  );
});

test("a blog can be updated", async () => {
  const blogsAtStart = await api.get("/api/blogs");

  const blogToUpdate = blogsAtStart.body[0];

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await api.get("/api/blogs");

  const blogAfterUpdate = blogsAtEnd.body.find(
    (blog) => blog.id === blogToUpdate.id,
  );

  assert.strictEqual(blogAfterUpdate.likes, updatedBlog.likes);
});

test("a new user can be added", async () => {
  const newUser = {
    username: "victoria",
    name: "Victoria",
    password: "secreto",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const userInDatabase = await User.findOne({
    username: newUser.username,
  });

  assert.notStrictEqual(userInDatabase.passwordHash, newUser.password);
});

test("users are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("a user with a too short username is not added", async () => {
  const newUser = {
    username: "vi",
    name: "Victoria",
    password: "secreto",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("a user with a too short password is not added", async () => {
  const newUser = {
    username: "victoria2",
    name: "Victoria",
    password: "12",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("a user without username is not added", async () => {
  const newUser = {
    name: "Victoria",
    password: "secreto",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("a user without password is not added", async () => {
  const newUser = {
    username: "victoria3",
    name: "Victoria",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("a user with an existing username is not added", async () => {
  const newUser = {
    username: "victoria",
    name: "Otra Victoria",
    password: "secreto",
  };

  const response = await api.post("/api/users").send(newUser).expect(400);

  assert(response.body.error);
});

// 👈 Cierra la conexión a la base de datos al finalizar
after(async () => {
  await mongoose.connection.close();
});
