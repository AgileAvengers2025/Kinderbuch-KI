const mongoose = require('mongoose');
const User = require('../models/User');

require("dotenv").config();
const db = process.env.MONGO_URI;
describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect( db , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create & save a user successfully', async () => {
    const validUser = new User({
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      displayName: 'Test User',
      kidsNames: ['Kid1', 'Kid2'],
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.passwordHash).toBe(validUser.passwordHash);
    expect(savedUser.displayName).toBe(validUser.displayName);
    expect(savedUser.kidsNames).toEqual(expect.arrayContaining(validUser.kidsNames));
  });

  it('should fail to create a user without required fields', async () => {
    const userWithoutRequiredField = new User({ displayName: 'Test User' });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.passwordHash).toBeDefined();
  });

  it('should fail to create a user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      email: 'invalidemail',
      passwordHash: 'hashedpassword',
      displayName: 'Test User',
    });
    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});