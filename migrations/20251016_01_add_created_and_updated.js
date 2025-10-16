const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "created_at", {
      type: DataTypes.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn("users", "created_at", {
      type: DataTypes.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn("blogs", "updated_at", {
      type: DataTypes.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn("users", "updated_at", {
      type: DataTypes.DATE,
      allowNull: false,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("blogs");
    await queryInterface.dropTable("users");
  },
};
