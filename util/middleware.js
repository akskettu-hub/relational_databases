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
    return res.status(401).json({ error: "token missing or malformed" });
  }
  next();
};

const userSessionValidator = async (req, res, next) => {
  try {
    const validSession = await ValidSession.findOne({
      where: { token: req.userToken },
      include: {
        model: User,
        attributes: ["username", "id", "diabled"],
      },
    });

    if (!validSession) {
      return res.status(401).json({
        error: "Token not associated with valid session.",
      });
    }

    req.user = validSession.user;

    if (req.user.diabled === true) {
      return res.status(401).json({
        error: "Access denied: User has been disabled by admin",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const unknowEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknow endpoint" });
};

const errorHandler = (error, _req, res, next) => {
  console.error("errorHandler: ", error.name, ":", error.message);

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).send({ error: error.message });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).send({ error: error.message });
  }

  if (error.name === "SequelizeValidationError") {
    if (
      error.message ===
      "Validation error: Validation isEmail on username failed"
    ) {
      return res
        .status(400)
        .send({ error: "Validation isEmail on username failed" });
    } else {
      return res.status(400).send({ error: error.message });
    }
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknowEndpoint,
  errorHandler,
  tokenExtractor,
  userSessionValidator,
};
