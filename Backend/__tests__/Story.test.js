const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Story = require("../models/Story"); // Adjust path if needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "demo" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Story Model Test", () => {
  it("should create and save a story successfully", async () => {
    const validStory = new Story({
      userId: "12345",
      title: "Magical Adventure",
      content: [
        { id: 1, text: "Once upon a time...", image: "image1.jpg" },
        { id: 2, text: "The journey continues...", image: "" },
      ],
    });

    const savedStory = await validStory.save();

    expect(savedStory._id).toBeDefined();
    expect(savedStory.userId).toBe("12345");
    expect(savedStory.title).toBe("Magical Adventure");
    expect(savedStory.content).toHaveLength(2);
    expect(savedStory.content[0].text).toBe("Once upon a time...");
    expect(savedStory.createdAt).toBeDefined();
    expect(savedStory.updatedAt).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const storyWithoutTitle = new Story({ userId: "12345" });

    let err;
    try {
      await storyWithoutTitle.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it("should apply default values", async () => {
    const story = new Story({
      userId: "67890",
      title: "Default Image Test",
      content: [{ id: 1, text: "No image provided" }],
    });

    const savedStory = await story.save();
    expect(savedStory.content[0].image).toBe(""); // Default value check
  });
});
