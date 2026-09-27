const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment');
  }

  await mongoose.connect(mongoUri);
  console.log('Database connected');
};

module.exports = connectDB;
