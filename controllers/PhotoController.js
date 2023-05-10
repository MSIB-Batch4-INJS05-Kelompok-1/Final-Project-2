const { Photo, User, Comment } = require("../models");

class PhotosController {
  static async postPhoto(req, res) {
    try {
      const { poster_image_url, title, caption } = req.body;
      const userId = req.userData.id;

      const photo = await Photo.create({
        poster_image_url,
        title,
        caption,
        UserId: userId,
      });

      res.status(201).json({
        id: photo.id,
        poster_image_url: photo.poster_image_url,
        title: photo.title,
        caption: photo.caption,
        UserId: photo.UserId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static async getPhotos(req, res) {
    try {
      const photos = await Photo.findAll({
        include: [
          {
            model: Comment,
            attributes: ["comment"],
            include: [
              {
                model: User,
                attributes: ["username"],
              },
            ],
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!photos) {
        return res.status(404).json({
          message: "Photos not found",
        });
      }
      res.status(200).json({
        photos: photos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static async editPhoto(req, res) {
    try {
      const { photoId } = req.params;
      const { poster_image_url, title, caption } = req.body;
      const userId = req.userData.id;

      const photo = await Photo.findOne({ where: { id: photoId } });
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      if (photo.UserId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (poster_image_url) photo.poster_image_url = poster_image_url;
      if (title) photo.title = title;
      if (caption) photo.caption = caption;

      await photo.save();
      res.status(200).json({
        photo: {
          id: photo.id,
          title: photo.title,
          caption: photo.caption,
          poster_image_url: photo.poster_image_url,
          UserId: photo.UserId,
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static async deletePhoto(req, res) {
    try {
      const { photoId } = req.params;
      const userId = req.userData.id;

      const photo = await Photo.findOne({ where: { id: photoId } });
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      if (photo.UserId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await photo.destroy();
      res
        .status(200)
        .json({ message: "Your photo has been successfully deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
}

module.exports = PhotosController;
