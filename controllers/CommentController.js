const { Comment, User, Photo } = require("../models");

class CommentController {
  static async createComment(req, res) {
    try {
      const { comment } = req.body;
      const userId = req.userData.id;
      const photoId = req.body.PhotoId;

      const photoData = await Photo.findOne({ where: { id: photoId } });

      if (!photoData) {
        return res.status(404).json({ message: "Photo not found" });
      }

      const Comments = await Comment.create({
        comment,
        PhotoId: photoId,
        UserId: userId,
      });

      res.status(201).json({
        comment: {
          id: Comments.id,
          comment: Comments.comment,
          UserId: Comments.UserId,
          PhotoId: Comments.PhotoId,
          createdAt: Comments.createdAt,
          updatedAt: Comments.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async getComment(req, res) {
    try {
      const Comments = await Comment.findAll({
        include: [
          {
            model: Photo,
            attributes: ["id", "title", "caption", "poster_image_url"],
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url", "phone_number"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        comments: Comments,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static async editComment(req, res) {
    try {
      const { commentId } = req.params;
      const { comment } = req.body;

      console.log(comment);
      const userId = req.userData.id;

      const commentData = await Comment.findOne({ where: { id: commentId } });
      if (!commentData) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (commentData.UserId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (comment) {
        commentData.comment = comment;
      }

      await commentData.save();
      res.status(200).json({
        comment: {
          id: commentData.id,
          comment: commentData.comment,
          UserId: commentData.UserId,
          PhotoId: commentData.PhotoId,
          createdAt: commentData.createdAt,
          updatedAt: commentData.updatedAt,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.userData.id;

      const Comments = await Comment.findOne({ where: { id: commentId } });
      if (!Comments) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (Comments.UserId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await Comments.destroy();
      res
        .status(200)
        .json({ message: "Your Comments has been successfully deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
}

module.exports = CommentController;
