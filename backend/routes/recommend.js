const express = require('express');
const router = express.Router();
const { auth, roleAllowed } = require('../middleware/auth');
const Recommend = require('../models/Recommend');
const User = require('../models/User');
const Vote = require('../models/Vote');

// 推荐歌曲（仅文案和管理）
router.post('/add', auth, roleAllowed(['文案', '管理']), async (req, res) => {
  const { episodeId, type, link, reason } = req.body;
  const user = await User.findByPk(req.user.id);

  const rec = await Recommend.create({
    UserId: req.user.id,
    EpisodeId: episodeId,
    username: user.username,
    nickname: user.nickname,
    type, link, reason,
    voteCount: 0
  });
  res.json({ msg: '推荐成功', rec });
});

// 获取某一期推荐列表
router.get('/list/:episodeId', async (req, res) => {
  const list = await Recommend.findAll({
    where: { EpisodeId: req.params.episodeId },
    order: [['voteCount', 'desc']]
  });
  res.json(list);
});

// ==================== 新增：编辑推荐 ====================
router.post('/edit', auth, async (req, res) => {
  try {
    const { id, type, link, reason } = req.body;
    const rec = await Recommend.findByPk(id);

    if (!rec) return res.status(400).json({ msg: '推荐不存在' });

    // 权限：本人 或 管理员
    if (rec.UserId !== req.user.id && req.user.role !== '管理') {
      return res.status(403).json({ msg: '无权限' });
    }

    await rec.update({ type, link, reason });
    res.json({ msg: '修改成功' });
  } catch (err) {
    res.status(500).json({ msg: '修改失败' });
  }
});

// ==================== 新增：删除推荐 ====================
router.post('/delete', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const rec = await Recommend.findByPk(id);

    if (!rec) return res.status(400).json({ msg: '推荐不存在' });

    if (rec.UserId !== req.user.id && req.user.role !== '管理') {
      return res.status(403).json({ msg: '无权限' });
    }

    // 删除关联投票
    await Vote.destroy({ where: { RecommendId: id } });
    // 删除推荐
    await rec.destroy();

    res.json({ msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ msg: '删除失败' });
  }
});

module.exports = router;