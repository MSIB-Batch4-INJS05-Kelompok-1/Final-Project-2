const router = require("express").Router();
const { authMiddleware } = require("../middlewares/auth");
const {
  createComment,
  getComment,
  editComment,
  deleteComment,
} = require("../controllers/CommentController");

// Photo Comment
router.get("/", authMiddleware, getComment);
router.post("/", authMiddleware, createComment);
router.put("/:commentId", authMiddleware, editComment);
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
