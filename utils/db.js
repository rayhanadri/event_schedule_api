require('dotenv').config();

// Access the MongoDB URI from the environment variables
const mongodbUri = process.env.MONGODB_URI;

const mongoose = require("mongoose");

mongoose.connect(mongodbUri);