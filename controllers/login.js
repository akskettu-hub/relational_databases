const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const ValidSession = require("../models/valid_sessions.js");

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    const user = await User.findOne({
      where: {
        username: body.username,
      },
    });

    const passwordCorrect = body.password === "secret";

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }

    if (user.diabled === true) {
      return res.status(401).json({
        error: "Access denied: User disabled by admin",
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });

    await ValidSession.create({
      userId: user.id,
      token: token,
      created_at: new Date(),
    });

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
