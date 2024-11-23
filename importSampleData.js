// backend/importSampleData.js

const mongoose = require('mongoose');
const axios = require('axios');
const FoodItem = require('./models/FoodItem');
const sampleData = require('./sampleData');

console.log('Đang kết nối tới MongoDB...');

mongoose
  .connect('mongodb://127.0.0.1:27017/food_ordering', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Kết nối MongoDB thành công.');

    try {
      // Xóa tất cả món ăn hiện có (tùy chọn)
      await FoodItem.deleteMany();
      console.log('Đã xóa tất cả món ăn cũ.');

      for (let item of sampleData) {
        console.log(`Đang xử lý món ăn: ${item.name}`);

        let imageUrl;

        if (item.category) {
          // Gọi API để lấy hình ảnh theo danh mục
          const response = await axios.get(
            `https://foodish-api.com/api/images/${item.category}`
          );

          if (response.data && response.data.image) {
            imageUrl = response.data.image;
          } else {
            console.error(`Không thể lấy hình ảnh cho món ăn: ${item.name}`);
            continue; // Bỏ qua món ăn này
          }
        } else {
          // Lấy hình ảnh ngẫu nhiên
          const response = await axios.get('https://foodish-api.com/api/');
          if (response.data && response.data.image) {
            imageUrl = response.data.image;
          } else {
            console.error(`Không thể lấy hình ảnh cho món ăn: ${item.name}`);
            continue; // Bỏ qua món ăn này
          }
        }

        const newFoodItem = new FoodItem({
          ...item,
          imageUrl,
        });

        await newFoodItem.save();
        console.log(`Đã thêm món ăn: ${item.name}`);
      }

      console.log('Thêm dữ liệu mẫu thành công!');
      process.exit();
    } catch (error) {
      console.error('Có lỗi xảy ra trong quá trình nhập dữ liệu:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Không thể kết nối tới MongoDB:', error);
    process.exit(1);
  });
