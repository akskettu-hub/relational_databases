require('dotenv').config()
const { QueryTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {}, // chaged this line from course material because the docker container does not seem to work otherwise.
});

const selectBlogs = async () => {
  const blogs = await sequelize.query("SELECT * FROM blogs", {
    type: QueryTypes.SELECT,
  });
  blogs.forEach(blog => {
    console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
  });
};

selectBlogs();
