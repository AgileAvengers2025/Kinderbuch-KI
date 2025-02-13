const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Prompt = require("../models/Prompt"); 

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "demo" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Prompt Model Test", () => {
  it("should create and save a prompt successfully", async () => {
    const validPrompt = new Prompt({
      title: "Magical Forest",
      prompt: "A wizard explores an enchanted forest.",
      scene: "A dense, glowing woodland.",
    });

    const savedPrompt = await validPrompt.save();

    expect(savedPrompt._id).toBeDefined();
    expect(savedPrompt.title).toBe("Magical Forest");
    expect(savedPrompt.prompt).toBe("A wizard explores an enchanted forest.");
    expect(savedPrompt.scene).toBe("A dense, glowing woodland.");
    expect(savedPrompt.createdAt).toBeDefined();
    expect(savedPrompt.updatedAt).toBeDefined();
  });

  it("should fail when required fields are missing", async () => {
    const promptWithoutTitle = new Prompt({ prompt: "Missing title", scene: "Dark cave" });

    let err;
    try {
      await promptWithoutTitle.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it("should enforce unique constraints on title and prompt", async () => {
    const prompt1 = new Prompt({
      title: "Unique Test",
      prompt: "This must be unique",
      scene: "A mysterious castle",
    });

    const prompt2 = new Prompt({
      title: "Unique Test",
      prompt: "This must be unique",
      scene: "A different setting",
    });

    await prompt1.save();

    let err;
    try {
      await prompt2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code in MongoDB
  });
});
