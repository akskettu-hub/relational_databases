const express = require("express");
const app = express();
const { errorHandler } = require("./util/middleware.js");
const { unknowEndpoint } = require("./util/middleware.js");

const { PORT } = require("./util/config.js");
const { connectToDatabase } = require("./util/db.js");

const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");
const authorsRouter = require("./controllers/authors.js")
const readingListRouter = require("./controllers/readingLists.js")
const logoutRouter = require("./controllers/logout.js")

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readingListRouter);
app.use("/api/logout", logoutRouter);

app.use(unknowEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
