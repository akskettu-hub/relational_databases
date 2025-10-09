const express = require("express");
const app = express();
const { errorHandler } = require("./util/middleware.js")
const { unknowEndpoint } = require("./util/middleware.js")

const { PORT } = require("./util/config.js");
const { connectToDatabase } = require("./util/db.js");

const blogsRouter = require("./controllers/blogs.js");

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use(unknowEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
