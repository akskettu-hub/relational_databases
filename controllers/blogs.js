const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    console.log(authorization);
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
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
      const { likes } = req.body;
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
