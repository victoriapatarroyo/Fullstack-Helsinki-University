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

// 👈 Cierra la conexión a la base de datos al finalizar
after(async () => {
  await mongoose.connection.close();
});
