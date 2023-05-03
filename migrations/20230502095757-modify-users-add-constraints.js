"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "phone_number", {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    });
    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "unique_email",
    });
    await queryInterface.addConstraint("Users", {
      fields: ["username"],
      type: "unique",
      name: "unique_username",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "phone_number", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeConstraint("Users", "unique_email");
    await queryInterface.removeConstraint("Users", "unique_username");
  },
};
