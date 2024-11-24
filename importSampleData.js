require('dotenv').config(); // Load biến môi trường từ file .env
const mongoose = require('mongoose');
const axios = require('axios');
const FoodItem = require('./models/FoodItem');
const sampleData = require('./sampleData'); // Giả sử đây là file chứa dữ liệu mẫu

console.log('Đang kết nối tới MongoDB...');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Kết nối MongoDB thành công.');

    try {
      // Tùy chọn: Xóa tất cả dữ liệu món ăn hiện có
      await FoodItem.deleteMany();
      console.log('Đã xóa tất cả món ăn cũ.');

      for (let item of sampleData) {
        console.log(`Đang xử lý món ăn: ${item.name}`);

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
              console.warn(`Không thể lấy hình ảnh cho danh mục: ${item.category}`);
              imageUrl = 'https://via.placeholder.com/150'; // Sử dụng hình ảnh mặc định
            }
          } else {
            // Lấy hình ảnh ngẫu nhiên
            const response = await axios.get('https://foodish-api.com/api/');
            if (response.data && response.data.image) {
              imageUrl = response.data.image;
            } else {
              console.warn(`Không thể lấy hình ảnh ngẫu nhiên cho món ăn: ${item.name}`);
              imageUrl = 'https://via.placeholder.com/150'; // Sử dụng hình ảnh mặc định
            }
          }
        } catch (err) {
          console.error(`Lỗi khi lấy hình ảnh cho món ăn: ${item.name}`, err.message);
          imageUrl = 'https://via.placeholder.com/150'; // Sử dụng hình ảnh mặc định khi lỗi xảy ra
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
      console.error('Có lỗi xảy ra trong quá trình nhập dữ liệu:', error.message);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Không thể kết nối tới MongoDB:', error.message);
    process.exit(1);
  });
