const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    console.log(authorization);
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
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
};
