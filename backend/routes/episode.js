// 创建播客期次接口

const express = require('express');
const router = express.Router();
const { auth, roleAllowed } = require('../middleware/auth');
const Episode = require('../models/Episode');

// 创建期次（仅管理）
router.post('/create', auth, roleAllowed(['管理']), async (req, res) => {
  const { name } = req.body;
  const ep = await Episode.create({ name });
  res.json({ msg: '创建成功', ep });
});

// 获取所有期次
router.get('/list', async (req, res) => {
  const list = await Episode.findAll({ order: [['id', 'desc']] });
  res.json(list);
});

module.exports = router;