const { Comment, User, Photo } = require("../models");

class CommentController {
    static async createComment (req, res) {
        try{
            const {comment} = req.body;
            const userId = req.userData.id;
            const photoId = req.body.PhotoId;

            const Comments = await Comment.create({
                comment,
                PhotoId : photoId
            });

            res.status(201).json({
                id : Comments.id,
                comment : Comments.comment,
                UserId : Comments.UserId,
                PhotoId : Comments.PhotoId,
                createdAt : Comments.createdAt,
                updatedAt: Comments.updatedAt,
            })
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
    static async getComment (req, res) {
        try{
            const Comments = await Comment.findAll({
                
                include : [
                    {
                    model : Photo,
                    attributes : ["id", "title", "caption", "poster_image_url"],
                    },
                    {
                        model : User,
                        attributes : ["id", "username", "profile_image_url", "phone_number"]
                    },
                ],
                order : [["createdAt", "DESC"]],
            });

            res.status(200).json(Comments);
        } catch (err) {
        console.error(err);
        res.status(500).json(err);
        }
    }

    static async editComment (req, res) {
        try{
            const { commentId } = req.params;
            const { comment } = req.body;
            const userId = req.userData.id;
            const photoId = req.body.PhotoId;

            const Comments = await Comment.findOne({ 
                where: { 
                    id: commentId, 
                } 
            });
            if (!Comments) {
                return res.status(404).json({ message : "not found" });
            }
            // if (Comments.userId !== userId) {
            //     return res.status(401).json({ message: "Unauthorized",});
            // }
            // if (Comments.PhotoId !== photoId) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }
            // if ( comment ) Comments.comment = comment;

            await Comments.save();
            res.status(200).json({
                Comments: {
                    id : Comments.id,
                    comment : Comments.comment,
                    userId : Comments.UserId,
                    photoId : Comments.PhotoId,
                    createdAt : Comments.createdAt,
                    updatedAt: Comments.updatedAt,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }

    static async deleteComment(req, res){
        try{
            const { commentId } = req.params;

            const Comments = await Comment.findOne({ where: { id: commentId } });
            if (!Comments) {
                return res.status(404).json({ message : "not found" })
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