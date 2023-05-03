require("dotenv").config();
const express = require("express");
const app = express();
const {
  register,
  login,
  edit,
  remove,
} = require("./controllers/UserController");
const {
  postPhoto,
  getPhotos,
  editPhoto,
  deletePhoto,
} = require("./controllers/PhotoController");
const {
  createSocialMedia,
  getSocialMedia,
  editSocialMedia,
  deleteSocialMedia,
} = require("./controllers/SocialMediaController");

const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV;
const {
  authMiddleware,
  authorizeUserMiddleware,
} = require("./middlewares/auth");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route masih kasar, nanti akan dibuat lebih rapi
// User Routes
app.post("/users/register", register);
app.post("/users/login", login);
app.put("/users/:userId", authMiddleware, authorizeUserMiddleware, edit);
app.delete("/users/:userId", authMiddleware, authorizeUserMiddleware, remove);

// Photo Routes
app.get("/photos", authMiddleware, getPhotos);
app.post("/photos", authMiddleware, postPhoto);
app.put("/photos/:photoId", authMiddleware, editPhoto);
app.delete("/photos/:photoId", authMiddleware, deletePhoto);

// Social Media Routes
app.post("/socialmedias", authMiddleware, createSocialMedia);
app.get("/socialmedias", authMiddleware, getSocialMedia);
app.put("/socialmedias/:socialMediaId", authMiddleware, editSocialMedia);
app.delete("/socialmedias/:socialMediaId", authMiddleware, deleteSocialMedia);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${env} mode`);
});

module.exports = app;
