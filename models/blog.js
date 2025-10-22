const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db.js");

class Blog extends Model { }
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true, // This allows Null because this column was added in migration, and blogs added before that would not contain this field.
      validate: {
        min: 1991,
        max(value) {
          if (value > new Date().getFullYear()) {
            throw new Error("Year cannot be after current year");
          }
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  },
);

module.exports = Blog;
