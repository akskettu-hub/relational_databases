const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    next(error);
  }
});

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      const { likes } = req.body
      if (likes === undefined) {
        res.status(400).json({ error: "Missing likes field" }).end();
      } else {
        req.blog.likes = likes;
        const updatedBlog = await req.blog.save();
        res.json(updatedBlog);
      }
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
