const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const ValidSession = require("../models/valid_sessions");
const { User } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.userToken = authorization.substring(7);
    try {
      req.decodedToken = jwt.verify(req.userToken, SECRET);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const userTokenValidator = async (req, res, next) => {
  try {
    const validToken = await ValidSession.findOne({
      where: { userId: req.decodedToken.id },
      include: {
        model: User,
        attributes: ["username", "id", "diabled"],
      },
    });

    req.user = validToken.user;

    if (req.user.diabled === true) {
      return res.status(401).json({
        error: "User has been disabled by admin",
      });
    }

    if (!validToken) {
      return res.status(401).json({
        error: "User has no active session.",
      });
    }

    if (validToken.token !== req.userToken) {
      return res.status(401).json({
        error: "User does not have a valid session",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error("errorHandler: ", error.name, ":", error.message);

  if (error.name === "SequelizeDatabaseError") {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === "SequelizeValidationError") {
    if (
      error.message ===
      "Validation error: Validation isEmail on username failed"
    ) {
      return response
        .status(400)
        .send({ error: "Validation isEmail on username failed" });
    } else {
      return response.status(400).send({ error: error.message });
    }
  }

  next(error);
};

module.exports = {
  unknowEndpoint,
  errorHandler,
  tokenExtractor,
  userTokenValidator,
};
