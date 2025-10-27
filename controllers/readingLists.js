const router = require("express").Router();
const { ReadingList } = require("../models");
const { tokenExtractor, userSessionValidator } = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    const newEntry = await ReadingList.create({ userId, blogId });
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  tokenExtractor,
  userSessionValidator,
  async (req, res, next) => {
    try {
      const readingListEntry = await ReadingList.findByPk(req.params.id);

      if (!readingListEntry) {
        res
          .status(404)
          .json({ error: "No reading list entry with provided id found" });
      } else if (readingListEntry.userId === req.decodedToken.id) {
        const { read } = req.body;
        if (read !== undefined) {
          readingListEntry.readMark = read;
          const updatedEntry = await readingListEntry.save();
          res.json(updatedEntry);
        } else {
          res.status(400).json({ error: "Value of read missing." });
        }
      } else {
        res.status(401).json({
          error: "Read status can only be modified by associated user",
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
