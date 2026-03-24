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

// 管理员修改期次状态

router.post('/status', auth, async (req, res) => {
  try {
    if (req.user.role !== '管理') {
      return res.status(403).json({ msg: '无权限' });
    }
    const { id, status } = req.body;
    await Episode.update({ status }, { where: { id } });
    res.json({ msg: '状态已更新' });
  } catch (err) {
    res.status(500).json({ msg: '操作失败' });
  }
});

module.exports = router;