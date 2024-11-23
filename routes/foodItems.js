// routes/fooditems.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const FoodItem = require('../models/FoodItem');

/**
 * @swagger
 * tags:
 *   name: FoodItems
 *   description: API quản lý món ăn
 */

/**
 * @swagger
 * /api/fooditems:
 *   get:
 *     summary: Lấy danh sách món ăn với chức năng tìm kiếm
 *     tags: [FoodItems]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Từ khóa tìm kiếm theo tên món ăn
 *     responses:
 *       200:
 *         description: Trả về danh sách món ăn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FoodItem'
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  const { search } = req.query; // Lấy từ khóa tìm kiếm từ query string
  try {
    const query = search
      ? { name: { $regex: search, $options: 'i' } } // Tìm theo tên (không phân biệt chữ hoa/thường)
      : {};
    const foodItems = await FoodItem.find(query);
    res.json(foodItems);
  } catch (err) {
    console.error('Error fetching food items:', err.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách món ăn.' });
  }
});

/**
 * @swagger
 * /api/fooditems/add:
 *   post:
 *     summary: Thêm món ăn mới
 *     tags: [FoodItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên món ăn
 *               description:
 *                 type: string
 *                 description: Mô tả món ăn
 *               price:
 *                 type: number
 *                 description: Giá của món ăn
 *               category:
 *                 type: string
 *                 description: Danh mục của món ăn
 *     responses:
 *       201:
 *         description: Món ăn được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodItem'
 *       400:
 *         description: Thiếu thông tin đầu vào hoặc thông tin không hợp lệ
 *       500:
 *         description: Lỗi server
 */

router.post('/add', async (req, res) => {
  const { name, description, price, category } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (name, price, category).' });
  }

  try {
    let imageUrl;

    if (category) {
      // Giả sử category là tên của loại món ăn, như 'pizza', 'sushi', v.v.
      const response = await axios.get(`https://foodish-api.com/api/images/${category}`);
      if (response.data && response.data.image) {
        imageUrl = response.data.image;
      }
    } else {
      // Nếu không có category, lấy ngẫu nhiên một hình ảnh
      const response = await axios.get('https://foodish-api.com/api/');
      if (response.data && response.data.image) {
        imageUrl = response.data.image;
      }
    }

    const newFoodItem = new FoodItem({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (err) {
    console.error('Error adding food item:', err.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm món ăn mới.' });
  }
});

module.exports = router;
