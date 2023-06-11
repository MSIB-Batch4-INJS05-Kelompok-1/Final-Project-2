const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

describe("Comment routes", () => {
  let token;
  let photoId;
  let commentId;
  let anotherCommentId;

  beforeAll(async () => {
    const userData = {
      email: "testing@mail.com",
      full_name: "testing",
      username: "testing",
      password: "testing",
      profile_image_url: "testing.com",
      age: 20,
      phone_number: "081234567890",
    };
    const userResponse = await request(app)
      .post("/users/register")
      .send(userData);
    const loginResponse = await request(app)
      .post("/users/login")
      .send({ email: userData.email, password: userData.password });
    token = loginResponse.body.token;

    const photoDetails = {
      poster_image_url: "testing.com",
      title: "testing",
      caption: "testing",
    };
    const photoResponse = await request(app)
      .post("/photos")
      .send(photoDetails)
      .set("token", token);
    photoId = photoResponse.body.id;

    const anotherUser = {
      email: "another@mail.com",
      full_name: "another",
      username: "another",
      password: "another",
      profile_image_url: "another.com",
      age: 20,
      phone_number: "081234567890",
    };
    const anotherUserResponse = await request(app)
      .post("/users/register")
      .send(anotherUser);
    const anotherUserLoginResponse = await request(app)
      .post("/users/login")
      .send({ email: anotherUser.email, password: anotherUser.password });
    const anotherUserToken = anotherUserLoginResponse.body.token;

    const anotherComment = {
      comment: "another",
      PhotoId: photoId,
    };
    const anotherCommentResponse = await request(app)
      .post("/comments")
      .send(anotherComment)
      .set("token", anotherUserToken);
    anotherCommentId = anotherCommentResponse.body.comment.id;
  });

  describe("POST /comments", () => {
    it("should create a new comment and return 201", async () => {
      const commentDetails = {
        comment: "testing",
        PhotoId: photoId,
      };
      const res = await request(app)
        .post("/comments")
        .send(commentDetails)
        .set("token", token);
      commentId = res.body.comment.id;
      expect(res.statusCode).toBe(201);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("comment");
      expect(res.body.comment).toHaveProperty("id");
      expect(res.body.comment).toHaveProperty("comment");
      expect(res.body.comment).toHaveProperty("PhotoId");
      expect(res.body.comment).toHaveProperty("UserId");
      expect(res.body.comment).toHaveProperty("createdAt");
      expect(res.body.comment).toHaveProperty("updatedAt");
    });

    it("should return status 401 if there is no authentication", async () => {
      const commentDetails = {
        comment: "",
        PhotoId: photoId,
      };
      const res = await request(app)
        .post("/comments")
        .send(commentDetails);

      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return 500 if comment is empty", async () => {
      const commentDetails = {
        comment: "",
        PhotoId: photoId,
      };
      const res = await request(app)
        .post("/comments")
        .send(commentDetails)
        .set("token", token);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors[0]).toHaveProperty("message");
      expect(res.body.errors[0].message).toEqual("Comment cannot be empty");
    });
  });

  describe("GET /comments", () => {
    it("should return status 200 if comment is found", async () => {
      const res = await request(app)
        .get("/comments")
        .set("token",token);

      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("comments");
      expect(res.body.comments.length).toBeGreaterThan(0);
      expect(res.body.comments[0]).toHaveProperty("id");
    });

    it("should return 401 if there is no authentication", async () => {
      const res = await request(app).get("/comments");
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    })
  });

  describe ("PUT /comments/:commentsId", () => {
    it("Should return status 200 if Comment is updated successfully", async () => {
      const res = await request(app)
        .put(`/comments/${commentId}`)
        .send({ comment: "Exelent!!"})
        .set("token", token);

      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("comment");
      expect(res.body.comment).toHaveProperty("id");
      expect(res.body.comment).toHaveProperty("comment");
      expect(res.body.comment.comment).toBe("Exelent!!");

    });

    it("Should return status 401 if there is no authentication", async () => {
      const res = await request(app)
        .put(`/comments/${commentId}`)
        .send({ comment: "Exelent!!"});

      expect(res.statusCode).toBe(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return status 401 if Comments is not owned by the user", async () => {
      const res = await request(app)
        .put(`/comments/${anotherCommentId}`)
        .send({ comment: "Exelent!!"})
        .set("token", token);

      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Unauthorized");
    });

    it("should return status 404 if Comments is not found", async () => {
      const res = await request(app)
        .put("/comments/0")
        .send({ comment: "Exelent!!"})
        .set("token", token);

      expect(res.statusCode).toEqual(404);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Comment not found");
    });

  });
  describe ("DELETE /comments/:commentsId", () => {
    it("should return status 200 if Comment is delete successfully", async () => {
      const res = await request(app)
       .delete(`/comments/${commentId}`)
       .set("token", token);

       expect(res.statusCode).toBe(200);
       expect(typeof res.body).toEqual("object");
       expect(res.body).toHaveProperty("message");
       expect(typeof res.body.message).toEqual("string");
       expect(res.body).toHaveProperty("message", "Your Comments has been successfully deleted");
    });

    it("should return 401 status code if the Comment is not owned by the user", async () => {
      const res = await request(app)
        .delete(`/comments/${anotherCommentId}`)
        .set("token", token);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Unauthorized");
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app)
        .delete(`/comments/${commentId}`);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return status 404 if Comments is not found", async () => {
      const res = await request(app)
        .delete("/comments/0")
        .set("token", token);
      expect(res.statusCode).toEqual(404);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Comment not found");
    });
  });
  afterAll(async () => {
    // Clean up database
    await sequelize.models.Comment.destroy({ where: {} });
    await sequelize.models.Photo.destroy({ where: {} });
    await sequelize.models.User.destroy({ where: {} });
    await sequelize.close();
  });
});