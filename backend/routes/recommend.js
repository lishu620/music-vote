const express = require('express');
const router = express.Router();
const { auth, roleAllowed } = require('../middleware/auth');
const Recommend = require('../models/Recommend');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Episode = require('../models/Episode');

// 推荐歌曲（仅文案和管理 + 状态判断）
router.post('/add', auth, roleAllowed(['文案', '管理']), async (req, res) => {
  try {
    const { episodeId, type, link, reason } = req.body;

    const episode = await Episode.findByPk(episodeId);
    if (episode.status !== 'submit') {
      return res.status(400).json({ msg: '当前已停止文案提交' });
    }

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
  } catch (err) {
    res.status(500).json({ msg: '提交失败' });
  }
});

// 获取某一期推荐列表
router.get('/list/:episodeId', async (req, res) => {
  const list = await Recommend.findAll({
    where: { EpisodeId: req.params.episodeId },
    order: [['voteCount', 'desc']]
  });
  res.json(list);
});

// 编辑推荐
router.post('/edit', auth, async (req, res) => {
  try {
    const { id, type, link, reason } = req.body;
    const rec = await Recommend.findByPk(id);

    if (!rec) return res.status(400).json({ msg: '推荐不存在' });

    if (rec.UserId !== req.user.id && req.user.role !== '管理') {
      return res.status(403).json({ msg: '无权限' });
    }

    await rec.update({ type, link, reason });
    res.json({ msg: '修改成功' });
  } catch (err) {
    res.status(500).json({ msg: '修改失败' });
  }
});

// 删除推荐
router.post('/delete', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const rec = await Recommend.findByPk(id);

    if (!rec) return res.status(400).json({ msg: '推荐不存在' });

    if (rec.UserId !== req.user.id && req.user.role !== '管理') {
      return res.status(403).json({ msg: '无权限' });
    }

    await Vote.destroy({ where: { RecommendId: id } });
    await rec.destroy();

    res.json({ msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ msg: '删除失败' });
  }
});

module.exports = router;