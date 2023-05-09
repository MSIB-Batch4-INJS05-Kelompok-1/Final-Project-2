const router = require("express").Router();
const { authMiddleware, authorizeUserMiddleware, } = require("../middlewares/auth");
const { register, login, edit, remove, } = require("../controllers/UserController");


router.post("/register", register);
router.post("/login", login);
router.put("/:userId", authMiddleware, authorizeUserMiddleware, edit);
router.delete("/:userId", authMiddleware, authorizeUserMiddleware, remove);

module.exports = router;