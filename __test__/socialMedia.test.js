const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

describe("Social media routes", () => {
  let token;
  let socialMediaId;
  let anotherSocialMediaId;

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

    const anotherSocialMediaDetails = {
      name: "another",
      social_media_url: "another.com",
    };
    const anotherSocialMediaResponse = await request(app)
      .post("/socialmedias")
      .send(anotherSocialMediaDetails)
      .set("token", anotherUserToken);
    anotherSocialMediaId = anotherSocialMediaResponse.body.social_media.id;
  });

  const socialMediaDetails = {
    name: "testing",
    social_media_url: "testing.com",
  };

  describe("POST /socialmedias", () => {
    it("should return status 201 if social media is created successfully", async () => {
      const res = await request(app)
        .post("/socialmedias")
        .send(socialMediaDetails)
        .set("token", token);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("social_media");
      expect(res.body.social_media).toHaveProperty("id");
      expect(res.body.social_media).toHaveProperty("name");
      expect(res.body.social_media).toHaveProperty("social_media_url");
      expect(res.body.social_media.name).toBe(socialMediaDetails.name);
      expect(res.body.social_media.social_media_url).toBe(
        socialMediaDetails.social_media_url
      );
      socialMediaId = res.body.social_media.id;
    });

    it("should return status 500 if name is empty", async () => {
      const res = await request(app)
        .post("/socialmedias")
        .send({ ...socialMediaDetails, name: "" })
        .set("token", token);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("name");
      expect(res.body.name).toContain("SequelizeValidationError");
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Name cannot be empty",
          }),
        ])
      );
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app)
        .post("/socialmedias")
        .send(socialMediaDetails);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });
  });

  describe("GET /socialmedias", () => {
    it("should return status 200 if social media is found", async () => {
      const res = await request(app).get("/socialmedias").set("token", token);
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("social_media");
      expect(res.body.social_media[0]).toHaveProperty("id");
      expect(res.body.social_media[0]).toHaveProperty("name");
      expect(res.body.social_media[0]).toHaveProperty("social_media_url");
      expect(res.body.social_media[0]).toHaveProperty("createdAt");
      expect(res.body.social_media[0]).toHaveProperty("updatedAt");
      expect(res.body.social_media[0]).toHaveProperty("User");
      expect(res.body.social_media).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: socialMediaId,
            name: socialMediaDetails.name,
            social_media_url: socialMediaDetails.social_media_url,
          }),
        ])
      );
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app).get("/socialmedias");
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });
  });

  describe("PUT /socialmedias/:socialMediaId", () => {
    it("should return status 200 if social media is updated successfully", async () => {
      const res = await request(app)
        .put(`/socialmedias/${socialMediaId}`)
        .send({ name: "testing2", social_media_url: "testing2.com" })
        .set("token", token);
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("social_media");
      expect(res.body.social_media).toHaveProperty("id");
      expect(res.body.social_media).toHaveProperty("name");
      expect(res.body.social_media).toHaveProperty("social_media_url");
      expect(res.body.social_media.name).toBe("testing2");
      expect(res.body.social_media.social_media_url).toBe("testing2.com");
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app)
        .put(`/socialmedias/${socialMediaId}`)
        .send({ name: "testing2", social_media_url: "testing2.com" });
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return status 401 if the user is not authorized", async () => {
      const res = await request(app)
        .put(`/socialmedias/${anotherSocialMediaId}`)
        .send({ name: "testing2", social_media_url: "testing2.com" })
        .set("token", token);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Unauthorized");
    });

    it("should return status 404 if social media is not found", async () => {
      const res = await request(app)
        .put("/socialmedias/0")
        .send({ name: "testing2", social_media_url: "testing2.com" })
        .set("token", token);
      expect(res.statusCode).toEqual(404);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Social Media not found");
    });
  });

  describe("DELETE /socialmedias/:socialMediaId", () => {
    it("should return status 200 if social media is deleted successfully", async () => {
      const res = await request(app)
        .delete(`/socialmedias/${socialMediaId}`)
        .set("token", token);
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual(
        "Your social media has been successfully deleted"
      );
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app).delete(`/socialmedias/${socialMediaId}`);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return status 401 if the user is not authorized", async () => {
      const res = await request(app)
        .delete(`/socialmedias/${anotherSocialMediaId}`)
        .set("token", token);
      expect(res.statusCode).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Unauthorized");
    });

    it("should return status 404 if social media is not found", async () => {
      const res = await request(app)
        .delete("/socialmedias/0")
        .set("token", token);
      expect(res.statusCode).toEqual(404);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Social Media not found");
    });
  });

  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("SocialMedia", {});
    await sequelize.queryInterface.bulkDelete("Users", {});
  });
});
