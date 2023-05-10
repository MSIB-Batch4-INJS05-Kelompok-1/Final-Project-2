require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routers/userRouter");
const photoRouter = require("./routers/photoRouter");
const socialMediaRouter = require("./routers/socialMediaRouter");
const commentRouter = require("./routers/commentRouter");
const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/photos", photoRouter);
app.use("/comments", commentRouter);
app.use("/socialmedias", socialMediaRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${env} mode`);
});

module.exports = app;
