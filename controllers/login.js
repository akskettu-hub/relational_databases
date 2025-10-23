const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const ValidSession = require("../models/valid_sessions.js");

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  if (user.diabled === true) {
    return response.status(401).json({
      error: "Access denied: User disabled by admin",
    });
  }

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await ValidSession.destroy({
    where: { userId: user.id },
  });

  const session = await ValidSession.create({
    userId: user.id,
    token: token,
    created_at: new Date(),
  });

  console.log(session.toJSON());

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
