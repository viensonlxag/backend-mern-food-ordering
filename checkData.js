require('dotenv').config(); // Load biến môi trường từ file .env
const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');

// Kết nối MongoDB từ biến môi trường hoặc mặc định localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Đã kết nối tới MongoDB.');

    try {
      const foodItems = await FoodItem.find();

      if (foodItems.length === 0) {
        console.log('Không tìm thấy món ăn nào trong cơ sở dữ liệu.');
      } else {
        foodItems.forEach((item, index) => {
          console.log(`Món ăn #${index + 1}`);
          console.log(`Tên món: ${item.name}`);
          console.log(`URL hình ảnh: ${item.imageUrl || 'Không có URL hình ảnh'}`);
          console.log('-----------------------------');
        });
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy dữ liệu:', error.message);
    } finally {
      mongoose.connection.close(() => {
        console.log('Đã ngắt kết nối MongoDB.');
        process.exit(0);
      });
    }
  })
  .catch((error) => {
    console.error('Không thể kết nối tới MongoDB:', error.message);
    process.exit(1);
  });
