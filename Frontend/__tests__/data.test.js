const data = require("../app/api/generate/dummy");

describe("Data Module", () => {
  test("should be an array", () => {
    expect(Array.isArray(data)).toBe(true);
  });

  test("should have 7 entries", () => {
    expect(data.length).toBe(7);
  });

  test("each item should have 'id' and 'prompt' properties", () => {
    data.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("prompt");
    });
  });

  test("IDs should be unique", () => {
    const ids = data.map(item => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("Prompts should be non-empty strings", () => {
    data.forEach(item => {
      expect(typeof item.prompt).toBe("string");
      expect(item.prompt.length).toBeGreaterThan(0);
    });
  });
});
