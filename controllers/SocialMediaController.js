const { SocialMedia, User } = require("../models");

class SocialMediaController {
  static async createSocialMedia(req, res) {
    try {
      const { name, social_media_url } = req.body;
      const userId = req.userData.id;

      const socialMedia = await SocialMedia.create({
        name,
        social_media_url,
        UserId: userId,
      });

      res.status(201).json({
        social_media: socialMedia,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getSocialMedia(req, res) {
    try {
      const socialMedia = await SocialMedia.findAll({
        include: {
          model: User,
          attributes: ["id", "username", "profile_image_url"],
        },
      });

      res.status(200).json({
        social_media: socialMedia,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async editSocialMedia(req, res) {
    try {
      const { name, social_media_url } = req.body;
      const { socialMediaId } = req.params;

      const socialMedia = await SocialMedia.findOne({
        where: {
          id: socialMediaId,
        },
      });

      if (!socialMedia) {
        return res.status(404).json({
          message: "Social Media not found",
        });
      }

      if (socialMedia.UserId !== req.userData.id) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (name) socialMedia.name = name;
      if (social_media_url) socialMedia.social_media_url = social_media_url;

      await socialMedia.save();

      res.status(200).json({
        social_media: socialMedia,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deleteSocialMedia(req, res) {
    try {
      const { socialMediaId } = req.params;

      const socialMedia = await SocialMedia.findOne({
        where: {
          id: socialMediaId,
        },
      });

      if (!socialMedia) {
        return res.status(404).json({
          message: "Social Media not found",
        });
      }

      if (socialMedia.UserId !== req.userData.id) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      await socialMedia.destroy();

      res.status(200).json({
        message: "Your social media has been successfully deleted",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = SocialMediaController;
