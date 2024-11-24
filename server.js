const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerSetup = require('./swagger'); // Import file Swagger
const helmet = require('helmet'); // Bảo mật HTTP header
const morgan = require('morgan'); // Middleware log request
const foodItemsRouter = require('./routes/foodItems');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const contactRoutes = require('./routes/contact');

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Middleware bảo mật HTTP Header với helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://backend-mern-food-ordering.onrender.com"], // Cho phép hình ảnh từ Render
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Đảm bảo hoạt động với hình ảnh cross-origin
  })
);

// Middleware log request
app.use(morgan('dev'));

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://frontend-mern-food-ordering.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các method được phép
    credentials: true,
  })
);

// Middleware parse JSON
app.use(express.json());

// Middleware xử lý lỗi tổng quát (giữ sau các route khác)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server!' });
});

// Tích hợp Swagger
swaggerSetup(app);

// Routes
app.use('/api/foodItems', foodItemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/contact', contactRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('API is healthy');
});

// Route mặc định cho trang chính
app.get('/', (req, res) => {
  res.redirect('/api-docs'); // Chuyển hướng tới tài liệu Swagger
});

// Kết nối MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MONGODB_URI không được thiết lập trong biến môi trường.');
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Đã kết nối tới MongoDB'))
  .catch((err) => {
    console.error('Không thể kết nối tới MongoDB:', err.message);
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  console.log('MongoDB đã kết nối thành công!');
});

mongoose.connection.on('error', (err) => {
  console.error('Lỗi kết nối MongoDB:', err.message);
});

// Middleware xử lý lỗi cho các route không tồn tại
app.use((req, res, next) => {
  res.status(404).send({
    error: 'Route không tồn tại. Vui lòng kiểm tra lại URL.',
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  const API_URL = process.env.API_URL || 'https://backend-mern-food-ordering.onrender.com';
console.log(`API docs available at ${API_URL}/api-docs`);

});
