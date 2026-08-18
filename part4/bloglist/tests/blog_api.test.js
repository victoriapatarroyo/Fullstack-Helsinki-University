const { test } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");

const app = require("../app");

const api = supertest(app);

test("blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.ok(Array.isArray(response.body));
});
