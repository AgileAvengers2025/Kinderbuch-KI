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

    test("should connect to MongoDB successfully", async () =>
    {
        mongoose.connect.mockResolvedValueOnce({});
        await connectDB();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    });

    test("should handle connection failure", async () =>
    {
        const errorMsg = "Connection failed!";
        
        mongoose.connect.mockRejectedValueOnce(new Error(errorMsg));

        const exitSpy = jest.spyOn(process, "exit").mockImplmentation(() => {});

        await connectDB();

        expect(console.error).toHaveBeenCalledWith(errorMsg);
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});