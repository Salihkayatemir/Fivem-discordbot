require("dotenv").config();
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE);
const registerSchema = new Schema({
  registrar: { type: String, required: true },
  registercount: { type: Number, default: 0 },
});

module.exports = model('Register', registerSchema);
