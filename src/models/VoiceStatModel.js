require("dotenv").config();
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE);
const VoiceStatSchema = new Schema({
  userId: { type: String, required: true },
  duration: { type: Number, default: 0 },
});

module.exports = model('VoiceStatModel', VoiceStatSchema);
