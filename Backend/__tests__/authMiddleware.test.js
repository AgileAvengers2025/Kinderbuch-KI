const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(authMiddleware);
app.get("/protected", (req, res) => res.json({ user: req.user }));

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  const SECRET = "testsecret"; // Mock secret key
  process.env.SECRET = SECRET;

  it("should return 401 if no Authorization header is provided", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Authorization header must start with 'Bearer '",
    });
  });

  it("should return 401 if Authorization header does not start with 'Bearer '", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "InvalidToken");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Authorization header must start with 'Bearer '",
    });
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Token is invalid" });
  });

  it("should call next() and attach user to req if token is valid", async () => {
    const mockUser = { id: 1, username: "testuser" };

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer validtoken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: mockUser });
  });
});
