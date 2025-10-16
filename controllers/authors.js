const router = require("express").Router();

const { Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (_req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "n_blogs"],
      [sequelize.fn("SUM", sequelize.col("likes")), "n_likes"],
    ],
    group: ["author"],
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  });
  res.json(authors);
});

module.exports = router;
