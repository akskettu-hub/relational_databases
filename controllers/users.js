const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.create(req.body);
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

const userFinder = async (req, _res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } });
  next();
};

router.get("/:id", async (req, res, next) => {
  try {
    const through = {
      attributes: ["read_mark", "id"],
    };

    const { read } = req.query;

    if (read === "true") {
      through.where = { read_mark: true };
    } else if (read === "false") {
      through.where = { read_mark: false };
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: [""] },
      include: [
        {
          model: Blog,
          attributes: { exclude: ["userId"] },
        },
        {
          model: Blog,
          as: "user_reading_list",
          attributes: { exclude: ["userId"] },
          through,
        },
      ],
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch {
    next(error);
  }
});

router.put("/:username", userFinder, async (req, res, next) => {
  try {
    if (req.user) {
      const { username } = req.body;
      if (username === undefined) {
        res.status(400).json({ error: "Missing username field" }).end();
      } else {
        req.user.username = username;
        const updatedUserName = await req.user.save();
        res.json(updatedUserName);
      }
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
