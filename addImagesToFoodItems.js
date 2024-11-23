const mongoose = require('mongoose');
const axios = require('axios');
const FoodItem = require('./models/FoodItem');

mongoose.connect('mongodb://127.0.0.1:27017/food_ordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateFoodItemsWithImages() {
  try {
    const foodItems = await FoodItem.find();

    for (let item of foodItems) {
      let imageUrl;

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
    }

    console.log('Cập nhật hình ảnh cho tất cả món ăn thành công!');
    process.exit();
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    process.exit(1);
  }
}

updateFoodItemsWithImages();
