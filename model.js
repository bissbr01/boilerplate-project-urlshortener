//Set up mongoose connection
require('dotenv').config();
const mongoose = require("mongoose");
const mongoDB = process.env.MONGO_URI;

