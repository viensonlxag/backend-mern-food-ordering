require('dotenv').config(); // Sử dụng dotenv để load biến môi trường
const mongoose = require('mongoose');
const axios = require('axios');
const FoodItem = require('./models/FoodItem');

// Kết nối tới MongoDB từ biến môi trường hoặc localhost nếu không có
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Đã kết nối tới MongoDB'))
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });

async function updateFoodItemsWithImages() {
  try {
    const foodItems = await FoodItem.find();

    if (foodItems.length === 0) {
      console.log('Không có món ăn nào trong cơ sở dữ liệu để cập nhật.');
      return;
    }

    for (let item of foodItems) {
      let imageUrl;

      try {
        if (item.category) {
          // Gọi API để lấy hình ảnh theo danh mục
          const response = await axios.get(
            `https://foodish-api.com/api/images/${item.category}`
          );

          if (response.data && response.data.image) {
            imageUrl = response.data.image;
          } else {
            console.error(`Không tìm thấy hình ảnh cho danh mục: ${item.category}`);
            continue;
          }
        } else {
          // Lấy hình ảnh ngẫu nhiên
          const response = await axios.get('https://foodish-api.com/api/');
          if (response.data && response.data.image) {
            imageUrl = response.data.image;
          } else {
            console.error('Không thể lấy hình ảnh ngẫu nhiên');
            continue;
          }
        }

        if (imageUrl) {
          item.imageUrl = imageUrl;
          await item.save();
          console.log(`Cập nhật hình ảnh cho món ăn: ${item.name}`);
        }
      } catch (err) {
        console.error(`Lỗi khi cập nhật món ăn ${item.name}:`, err.message);
        continue;
      }
    }

    console.log('Cập nhật hình ảnh cho tất cả món ăn thành công!');
    process.exit();
  } catch (error) {
    console.error('Có lỗi xảy ra trong quá trình cập nhật:', error.message);
    process.exit(1);
  }
}

updateFoodItemsWithImages();
