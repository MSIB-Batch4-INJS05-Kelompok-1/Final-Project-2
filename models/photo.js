"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.hasMany(models.Comment);
    }
  }
  Photo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title cannot be empty",
          },
        },
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Caption cannot be empty",
          },
        },
      },
      poster_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUrl: true,
          notEmpty: {
            msg: "Title cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Photo",
    }
  );
  return Photo;
};
