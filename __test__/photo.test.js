const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

describe("Photo routes", () => {
  let token;
  let photoId;


  beforeAll(async () => {
    const user = {
      full_name: "John Doe",
      email: "johndoe@example.com",
      username: "johndoe",
      password: "password",
      profile_image_url: "https://example.com/profile.jpg",
      age: 25,
      phone_number: "1234567890",
    };

    // Register user
    await request(app).post("/users/register").send(user);

    // Login user and obtain token
    const loginResponse = await request(app)
      .post("/users/login")
      .send({ email: user.email, password: user.password });
    token = loginResponse.body.token;

    const photoDetails = {
        id: 1,
      title: "Testing Photo",
      caption: "This is a test photo",
      poster_image_url: "https://example.com/photo.jpg",
    };

    // Create photo
    const response = await request(app)
      .post("/photos")
      .send(photoDetails)
      .set("token", token);
    photoId = response.body.id;
  });

  describe("POST /photos", () => {
    it("should create a new photo and return status 201", async () => {
      const photoDetails = {
        title: "New Photo",
        caption: "This is a new photo",
        poster_image_url: "https://example.com/newphoto.jpg",
      };

      const res = await request(app)
        .post("/photos")
        .send(photoDetails)
        .set("token", token);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe(photoDetails.title);
      expect(res.body.caption).toBe(photoDetails.caption);
      expect(res.body.poster_image_url).toBe(photoDetails.poster_image_url);
    });

    it("should return status 401 if there is no authentication", async () => {
      const photoDetails = {
        title: "New Photo",
        caption: "This is a new photo",
        poster_image_url: "https://example.com/newphoto.jpg",
      };

      const res = await request(app)
        .post("/photos")
        .send(photoDetails);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");

    });
    it("should return status 500 if there is no title", async () => {
        const photoDetails = {
            caption: "This is a new photo",
            poster_image_url: "https://example.com/newphoto.jpg",
        };
    
        const res = await request(app)
            .post("/photos")
            .send(photoDetails)
            .set("token", token);
    
        expect(res.statusCode).toBe(500);
        expect(res.body.name).toContain("SequelizeValidationError");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("message");
        expect(res.body.errors[0].instance).toHaveProperty("caption", "This is a new photo");
        }
    );
  });

  describe("GET /photos", () => {
    it("should return all photos and status 200", async () => {
      const res = await request(app)
        .get("/photos")
        .set("token", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("photos");
      expect(Array.isArray(res.body.photos)).toBe(true);
      expect(res.body.photos.length).toBeGreaterThan(0);
      expect(res.body.photos[0]).toHaveProperty("id");
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app)
        .get("/photos");

      expect(res.statusCode).toBe(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });
  });

  describe("PUT /photos/:photoId", () => {
    it("should update a photo and return status 200", async () => {
      const updatedPhotoDetails = {
        title: "Updated Photo",
        caption: "This photo has been updated",
        poster_image_url: "https://example.com/updatedphoto.jpg",
      };

      const res = await request(app)
        .put(`/photos/${photoId}`)
        .send(updatedPhotoDetails)
        .set("token", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("photo");
      expect(res.body.photo.id).toBe(photoId);
      expect(res.body.photo.title).toBe(updatedPhotoDetails.title);
      expect(res.body.photo.caption).toBe(updatedPhotoDetails.caption);
      expect(res.body.photo.poster_image_url).toBe(updatedPhotoDetails.poster_image_url);
    });

    it("should return status 401 if there is no authentication", async () => {
      const updatedPhotoDetails = {
        title: "Updated Photo",
        caption: "This photo has been updated",
        poster_image_url: "https://example.com/updatedphoto.jpg",
      };

      const res = await request(app)
        .put(`/photos/${photoId}`)
        .send(updatedPhotoDetails);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("No token provided");
    });

    it("should return status 404 if photo is not found", async () => {
        const updatedPhotoDetails = {
            title: "Updated Photo",
            caption: "This photo has been updated",
            poster_image_url: "https://example.com/updatedphoto.jpg",
        };
    
        const res = await request(app)
            .put("/photos/999999")
            .send(updatedPhotoDetails)
            .set("token", token);
    
        expect(res.statusCode).toBe(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Photo not found");
        });
    
        it("should return status 400 if title is empty", async () => {
          const updatedPhotoDetails = {
            title: "", // Empty title
            caption: "This photo has been updated",
            poster_image_url: "https://example.com/updatedphoto.jpg",
          };
        
          const res = await request(app)
            .put(`/photos/${photoId}`)
            .send(updatedPhotoDetails)
            .set("token", token);
        
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("message", "Validation error");
          expect(Array.isArray(res.body.errors)).toBe(true);
          expect(res.body.errors.length).toBeGreaterThan(0);
        });

  describe("DELETE /photos/:photoId", () => {
    it("should delete a photo and return status 200", async () => {
      const res = await request(app)
        .delete(`/photos/${photoId}`)
        .set("token", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Your photo has been successfully deleted");

      // Verify the photo is actually deleted
      const deletedPhoto = await sequelize.models.Photo.findByPk(photoId);
      expect(deletedPhoto).toBeNull();
    });

    it("should return status 401 if there is no authentication", async () => {
      const res = await request(app)
        .delete(`/photos/${photoId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "No token provided");
    });
  });

  afterAll(async () => {
    // Clean up database
    await sequelize.models.Photo.destroy({ where: {} });
    await sequelize.models.User.destroy({ where: {} });
    await sequelize.close();
  });
});  
});
