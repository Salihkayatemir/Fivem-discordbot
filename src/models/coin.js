

require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE);

const { Schema, model } = require('mongoose');

const coinSchema = new Schema({
  userID: { type: String, required: true },
  coins: { type: Number, default: 0 },
});

module.exports = model('Coin', coinSchema);