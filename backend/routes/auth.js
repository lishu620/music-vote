const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret, auth, roleAllowed } = require('../middleware/auth');

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickname, role } = req.body;

    if (!username || !password || !nickname || !role) {
      return res.status(400).json({ msg: '请填写完整信息' });
    }

    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ msg: '用户名已存在' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    await User.create({
      username,
      password: hashed,
      nickname,
      role
    });

    res.json({ msg: '注册成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ msg: '用户不存在' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: '密码错误' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '服务器错误' });
  }
});

// ==================== 管理员功能 ====================
// 获取所有用户
router.get('/all', auth, roleAllowed(['管理']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'nickname', 'role']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 管理员修改用户信息
router.post('/admin/update', auth, roleAllowed(['管理']), async (req, res) => {
  try {
    const { id, nickname, role } = req.body;
    await User.update({ nickname, role }, { where: { id } });
    res.json({ msg: '修改成功' });
  } catch (err) {
    res.status(500).json({ msg: '修改失败' });
  }
});

// 管理员重置密码为 admin@123
router.post('/reset-pwd', auth, roleAllowed(['管理']), async (req, res) => {
  try {
    const { id } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('admin@123', salt);
    await User.update({ password: hashed }, { where: { id } });
    res.json({ msg: '密码已重置为：admin@123' });
  } catch (err) {
    res.status(500).json({ msg: '重置失败' });
  }
});

// 用户修改个人密码
router.post('/update-pwd', auth, async (req, res) => {
  try {
    const { oldPwd, newPwd } = req.body;
    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(oldPwd, user.password);
    if (!match) return res.status(400).json({ msg: '原密码错误' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPwd, salt);
    await user.update({ password: hashed });
    res.json({ msg: '密码修改成功' });
  } catch (err) {
    res.status(500).json({ msg: '修改失败' });
  }
});

module.exports = router;