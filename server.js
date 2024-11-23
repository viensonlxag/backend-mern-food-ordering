const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerSetup = require('./swagger'); // Import file Swagger
const foodItemsRouter = require('./routes/foodItems');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const contactRoutes = require('./routes/contact');

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Chấp nhận mọi nguồn gốc hoặc URL frontend cụ thể
  credentials: true,
}));

// Middleware parse JSON
app.use(express.json());

// Tích hợp Swagger
swaggerSetup(app);

// Route mặc định
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Food Ordering API. Visit /api-docs for API documentation.');
});

// Routes API
app.use('/api/foodItems', foodItemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/contact', contactRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('API is healthy');
});

// Kết nối MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MONGODB_URI không được thiết lập trong biến môi trường.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Đã kết nối tới MongoDB'))
  .catch((err) => {
    console.error('Không thể kết nối tới MongoDB:', err);
    process.exit(1);
  });

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  console.log(`API docs available at ${process.env.API_URL || `https://your-api-domain.onrender.com`}/api-docs`);
});
