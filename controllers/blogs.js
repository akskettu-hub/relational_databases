const router = require("express").Router();

const { Blog, User } = require("../models");
const { Op } = require("sequelize");
const { tokenExtractor, userTokenValidator } = require("../util/middleware");

router.get("/", async (req, res) => {
  const where = req.query.search
    ? {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search } },
        { author: { [Op.substring]: req.query.search } },
      ],
    }
    : {};

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name", "username"],
    },
    where,
    order: [["likes", "DESC"]],
  });
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

router.post("/", tokenExtractor, userTokenValidator, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id,
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

router.delete("/:id", tokenExtractor, blogFinder, userTokenValidator, async (req, res) => {
  //const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    if (req.blog.userId !== req.decodedToken.id) {
      return res
        .status(401)
        .json({ error: "blogs can only be deleted by their creator" });
    }
    await req.blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
