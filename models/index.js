const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "user_reading_list" });
Blog.belongsToMany(User, {
  through: ReadingList,
  as: "on_users_reading_list",
});

module.exports = {
  Blog,
  User,
  ReadingList,
};
