// backend/checkData.js

const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');

mongoose.connect('mongodb://127.0.0.1:27017/food_ordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Đã kết nối tới MongoDB.');

  try {
    const foodItems = await FoodItem.find();
    foodItems.forEach(item => {
      console.log(`Tên món: ${item.name}`);
      console.log(`URL hình ảnh: ${item.imageUrl}`);
      console.log('-----------------------------');
    });
    process.exit();
  } catch (error) {
    console.error('Có lỗi xảy ra khi lấy dữ liệu:', error);
    process.exit(1);
  }
})
.catch((error) => {
  console.error('Không thể kết nối tới MongoDB:', error);
  process.exit(1);
});
