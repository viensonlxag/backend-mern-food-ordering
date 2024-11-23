const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Tham chiếu đến bảng User
  },
  items: [
    {
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FoodItem', // Tham chiếu đến bảng FoodItem
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
