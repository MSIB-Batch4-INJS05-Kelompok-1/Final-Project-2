const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
  static async register(req, res) {
    const {
      email,
      full_name,
      username,
      password,
      profile_image_url,
      age,
      phone_number,
    } = req.body;

    const hashedPassword = hashPassword(password);

    User.create({
      email,
      full_name,
      username,
      password: hashedPassword,
      profile_image_url,
      age,
      phone_number,
    })
      .then((result) => {
        let response = {
          user: {
            email: result.email,
            full_name: result.full_name,
            username: result.username,
            profile_image_url: result.profile_image_url,
            age: result.age,
            phone_number: result.phone_number,
          },
        };
        res.status(201).json(response);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid email/password",
        });
      }

      const isPasswordValid = comparePassword(req.body.password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Invalid email/password",
        });
      }

      const access_token = generateToken({
        id: user.id,
        email: user.email,
      });

      res.status(200).json({
        token: access_token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static async edit(req, res, next) {
    try {
      const { userId } = req.params;
      const {
        email,
        full_name,
        username,
        password,
        profile_image_url,
        age,
        phone_number,
      } = req.body;

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id !== req.userData.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (email) user.email = email;
      if (full_name) user.full_name = full_name;
      if (username) user.username = username;
      if (profile_image_url) user.profile_image_url = profile_image_url;
      if (age) user.age = age;
      if (phone_number) user.phone_number = phone_number;
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
      }

      await user.save();
      const access_token = generateToken({
        id: user.id,
        email: user.email,
      });

      res.status(200).json({
        user: {
          email: user.email,
          full_name: user.full_name,
          username: user.username,
          profile_image_url: user.profile_image_url,
          age: user.age,
          phone_number: user.phone_number,
          token: access_token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id !== req.userData.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await user.destroy();
      res
        .status(200)
        .json({ message: "Your account has been successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
