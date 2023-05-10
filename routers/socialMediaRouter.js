const router = require("express").Router();
const { authMiddleware } = require("../middlewares/auth");
const {
  createSocialMedia,
  getSocialMedia,
  editSocialMedia,
  deleteSocialMedia,
} = require("../controllers/SocialMediaController");

// Social Media Routes
router.post("/", authMiddleware, createSocialMedia);
router.get("/", authMiddleware, getSocialMedia);
router.put("/:socialMediaId", authMiddleware, editSocialMedia);
router.delete("/:socialMediaId", authMiddleware, deleteSocialMedia);

module.exports = router;
