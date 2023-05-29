const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

describe("Users routes", () => {
  const userData = {
    email: "testing@mail.com",
    full_name: "testing",
    username: "testing",
    password: "testing",
    profile_image_url: "testing.com",
    age: 20,
    phone_number: "081234567890",
  };
  let token;
  let userId;

  describe("POST /users/register", () => {
    it("should return 201 status code if the user is successfully created", async () => {
      const res = await request(app).post("/users/register").send(userData);
      expect(res.statusCode).toEqual(201);
      expect(typeof res.body).toEqual("object");
      expect(res.body.user).toHaveProperty("email");
      expect(res.body.user).toHaveProperty("full_name");
      expect(res.body.user).toHaveProperty("username");
      expect(res.body.user).toHaveProperty("profile_image_url");
      expect(res.body.user).toHaveProperty("age");
      expect(res.body.user).toHaveProperty("phone_number");
    });

    it("should return 500 status code if the email is already registered", async () => {
      const res = await request(app).post("/users/register").send(userData);
      expect(res.statusCode).toEqual(500);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("name");
      expect(res.body.name).toEqual("SequelizeUniqueConstraintError");
      expect(res.body.errors[0]).toHaveProperty("message");
      expect(res.body.errors[0].message).toEqual("email must be unique");
    });
  });

  describe("POST /users/login", () => {
    it("should return 200 status code if the user is successfully logged in", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({ email: userData.email, password: userData.password });
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("token");
      token = res.body.token;
      expect(typeof res.body.token).toEqual("string");
      expect(res.body.token).toEqual(expect.any(String));
    });

    it("should return 400 status code if the user is not registered", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({ email: "", password: "" });
      expect(res.statusCode).toEqual(400);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Invalid email/password");
    });
  });

  describe("PUT /users/:userId", () => {
    const photoDetails = {
      poster_image_url: "testing.com",
      title: "testing",
      caption: "testing",
    };

    beforeAll(async () => {
      const getUserId = await request(app)
        .post("/photos")
        .set("token", token)
        .send(photoDetails);
      userId = getUserId.body.UserId;
    });

    it("should return 200 status code if the user is successfully updated", async () => {
      const res = await request(app)
        .put(`/users/${userId}`)
        .set("token", token)
        .send(userData.username);
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email");
      expect(res.body.user).toHaveProperty("full_name");
      expect(res.body.user).toHaveProperty("username");
      expect(res.body.user).toHaveProperty("profile_image_url");
      expect(res.body.user).toHaveProperty("age");
      expect(res.body.user).toHaveProperty("phone_number");
    });

    it("should return 401 status code if there is no authentication", async () => {
      const res = await request(app).put("/users/1").send(userData.username);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return 401 status code if the user is not authorized", async () => {
      const wrongUserId = userId + 1;
      const res = await request(app)
        .put(`/users/${wrongUserId}`)
        .set("token", token)
        .send(userData.username);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Unauthorized");
    });
  });

  describe("DELETE /users/:userId", () => {
    it("should return 401 status code if there is no authentication", async () => {
      const res = await request(app).delete("/users/1");
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return 401 status code if the user is not authorized", async () => {
      const wrongUserId = userId + 1;
      const res = await request(app)
        .delete(`/users/${wrongUserId}`)
        .set("token", token);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Unauthorized");
    });

    it("should return 200 status code if the user is successfully deleted", async () => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set("token", token);
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual(
        "Your account has been successfully deleted"
      );
    });
  });

  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {});
    await sequelize.queryInterface.bulkDelete("Photos", null, {});
  });
});
