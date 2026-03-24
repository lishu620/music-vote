const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Comment = require('../models/Comment');
const User = require('../models/User'); // 👈 这里修复正确了

// 获取某首推荐的评论
router.get('/list/:recommendId', async (req, res) => {
  try {
    const { recommendId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const list = await Comment.findAll({
      where: { RecommendId: recommendId },
      order: [['id', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      raw: true  // 👈 关键修复
    });

    res.json(list);
  } catch (err) {
    res.status(500).json([]);
  }
});

// 发表评论
router.post('/add', auth, async (req, res) => {
  try {
    const { recommendId, content } = req.body;
    const user = await User.findByPk(req.user.id);

    await Comment.create({
      UserId: req.user.id,
      RecommendId: recommendId,
      nickname: user.nickname,
      content: content.trim()
    });

    res.json({ msg: '评论成功' });
  } catch (err) {
    res.status(500).json({ msg: '评论失败' });
  }
});

// 删除评论
router.post('/delete', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const comment = await Comment.findByPk(id);

    if (!comment) return res.status(400).json({ msg: '不存在' });

    if (comment.UserId !== req.user.id && req.user.role !== '管理') {
      return res.status(403).json({ msg: '无权限' });
    }

    await comment.destroy();
    res.json({ msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ msg: '删除失败' });
  }
});

module.exports = router;