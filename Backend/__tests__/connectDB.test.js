require("dotenv").config();
const mongoose = require("mongoose");

// mock to prevent actual connection to the db
jest.mock("mongoose");

const connectDB = require("../config/db");

describe("DB connection", () =>
{
    afterEach(() =>
    {
        jest.clearAllMocks(); // resetting mocks after tests
    });

    it("should handle connection failure", async () => {
        const errorMsg = "Connection failed!";

        jest.spyOn(console, "error").mockImplementation(() => {});

        const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

        jest.spyOn(mongoose, "connect").mockRejectedValueOnce(new Error(errorMsg));

        await connectDB();

        expect(console.error).toHaveBeenCalledWith(errorMsg);

        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});