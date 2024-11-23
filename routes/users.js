const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Thay bcrypt bằng bcryptjs

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      console.warn(`Profile Error: Người dùng với ID ${req.params.id} không tồn tại.`);
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    console.info(`Profile Retrieved: ${user._id} - ${user.name}`);
    res.json(user);
  } catch (err) {
    console.error('Profile Error:', err.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi.' });
  }
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Email đã được sử dụng
 *       500:
 *         description: Lỗi server
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`Register Error: Email ${email} đã được sử dụng.`);
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // bcryptjs hoạt động giống bcrypt

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.info(`User Registered: ${user._id} - ${user.name}`);
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.info(`Login Attempt: Email - ${email}`);
  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Login Failed: Email ${email} không tồn tại.`);
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password); // bcryptjs hoạt động giống bcrypt
    if (!isMatch) {
      console.warn(`Login Failed: Sai mật khẩu cho Email ${email}.`);
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Chuyển đổi đối tượng người dùng thành plain object và loại bỏ trường password
    const userData = user.toObject();
    delete userData.password;

    // Log dữ liệu người dùng sẽ được trả về
    console.info(`Login Success: User ID - ${userData._id}, Name - ${userData.name}, Email - ${userData.email}`);

    // Trả về phản hồi với dữ liệu người dùng đầy đủ
    res.json({
      message: 'Đăng nhập thành công',
      user: userData, // Bao gồm _id, name, email và các trường cần thiết khác
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
