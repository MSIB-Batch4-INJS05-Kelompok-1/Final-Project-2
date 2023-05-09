const router = require("express").Router();
const { authMiddleware, authorizeUserMiddleware, } = require("../middlewares/auth");
const { postPhoto, getPhotos, editPhoto, deletePhoto, } = require("../controllers/PhotoController");

// Photo Routes
router.get("/", authMiddleware, getPhotos);
router.post("/", authMiddleware, postPhoto);
router.put("/:photoId", authMiddleware, editPhoto);
router.delete("/:photoId", authMiddleware, deletePhoto);

module.exports = router;