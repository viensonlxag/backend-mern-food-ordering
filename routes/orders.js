const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API quản lý đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng (Admin Only)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Trả về danh sách tất cả đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách tất cả đơn hàng.' });
  }
});

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - totalPrice
 *               - customerName
 *               - address
 *               - phone
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - foodItem
 *                     - name
 *                     - price
 *                     - quantity
 *                   properties:
 *                     foodItem:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *               customerName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Thiếu thông tin đầu vào hoặc thông tin không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/create', async (req, res) => {
  const { userId, items, totalPrice, customerName, address, phone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  if (!userId || !items || !totalPrice || !customerName || !address || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin đơn hàng.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Danh sách sản phẩm không hợp lệ.' });
  }

  try {
    const calculatedTotalPrice = items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );

    if (calculatedTotalPrice !== totalPrice) {
      return res.status(400).json({ message: 'Tổng giá tiền không khớp với dữ liệu gửi lên.' });
    }

    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: items.map((item) => ({
        foodItem: item.foodItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalPrice: calculatedTotalPrice,
      customerName,
      address,
      phone,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Đơn hàng được tạo thành công.', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đơn hàng.' });
  }
});

/**
 * Lấy danh sách đơn hàng theo userId
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào cho người dùng này.' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.' });
  }
});

/**
 * Lấy chi tiết đơn hàng
 */
router.get('/:orderId/detail', async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid orderId hoặc userId' });
  }

  try {
    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order detail:', error.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết đơn hàng.' });
  }
});

module.exports = router;
