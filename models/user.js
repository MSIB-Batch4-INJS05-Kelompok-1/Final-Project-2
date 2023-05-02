'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Photo)
      this.hasMany(models.Comments)
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Full Name cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: {   
          msg: "Email cannot be empty"
        }
      },  
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Username cannot be empty"
          }
        }
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty"
        }
      }
    },
    profile_image_url: { 
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty: {
          msg: "Profile Url cannot be empty"
        }
      }

    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notEmpty: { 
          msg: "Age cannot be empty"
        }

      }
    },
    phone_number: { type: 
      DataTypes.INTEGER, 
      allowNull: false, 
      validate: {
        isInt: true,
        notEmpty: {
           msg: "Phone Number cannot be empty"
          }

      }
     },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};