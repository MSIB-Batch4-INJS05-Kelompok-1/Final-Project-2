"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
    }
  }
  SocialMedia.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name cannot be empty",
          },
        },
      },
      social_media_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUrl: true,
          notEmpty: {
            msg: "Social URL cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SocialMedia",
    }
  );
  return SocialMedia;
};
