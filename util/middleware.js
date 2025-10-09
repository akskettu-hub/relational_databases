const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error("errorHandler: ", error.name, ":", error.message);

  if (error.name === "SequelizeDatabaseError") {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknowEndpoint,
  errorHandler,
};
