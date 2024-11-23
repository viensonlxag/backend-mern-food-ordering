// backend/models/FoodItem.js

const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  imageUrl: String,
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
