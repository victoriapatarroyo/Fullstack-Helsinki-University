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

describe("favorite blog", () => {
  const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://example.com",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://example.com",
      likes: 12,
    },
  ];

  test("returns the blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);

    console.log(result);

    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most blogs", () => {
  const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
    },
  ];

  test("returns author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);

    console.log(result);

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 2,
    });
  });
});

describe("most likes", () => {
  const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
  ];

  test("returns author with most likes", () => {
    const result = listHelper.mostLikes(blogs);
    console.log(result);

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
