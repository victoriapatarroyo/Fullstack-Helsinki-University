const { test, describe } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Historia de Vicky",
      author: "Victoria Patarroyo",
      url: "https://vicky.com.co/blogs/historiadevicky",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
      { title: "A", likes: 1 },
      { title: "B", likes: 2 },
      { title: "C", likes: 3 },
    ];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 6);
  });
});
