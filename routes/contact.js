const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  try {
    // Đây là ví dụ, thực tế bạn có thể lưu dữ liệu vào database hoặc gửi email
    console.log('Tin nhắn liên hệ:', { name, email, message });
    res.status(200).json({ message: 'Tin nhắn của bạn đã được gửi thành công!' });
  } catch (err) {
    console.error('Lỗi khi xử lý liên hệ:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
  }
});

module.exports = router;
