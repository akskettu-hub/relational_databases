const router = require("express").Router();
const { ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    const newEntry = await ReadingList.create({ userId, blogId });
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});

// TODO: Clean up error handling for this route
router.put("/:id", tokenExtractor, async (req, res, next) => {
  const readingListEntry = await ReadingList.findByPk(req.params.id);
  console.log(req.decodedToken.id, readingListEntry.userId, readingListEntry)
  try {
    if (readingListEntry && readingListEntry.userId === req.decodedToken.id) {
      const { read } = req.body;
      if (read !== undefined) {
        readingListEntry.readMark = read;
        const updatedEntry = await readingListEntry.save();
        res.json(updatedEntry);
      } else {
        res.status(400), json({ error: "Value of read missing." })
      }
    } else {
      res
        .status(400)
        .json({ error: "Read status can only be modified by associated user" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
