const router = require("express").Router();
const { ReadingList } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body

    const newEntry = await ReadingList.create({ userId, blogId })
    res.status(201).json(newEntry)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
