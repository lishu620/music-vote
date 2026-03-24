const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Recommend = require('../models/Recommend');
const User = require('../models/User');
const Episode = require('../models/Episode'); // 👈 加这个

// 投票接口
router.post('/do', auth, async (req, res) => {
  try {
    const { episodeId, recommendId, num } = req.body;

    // ====================== 状态权限 ======================
    const episode = await Episode.findByPk(episodeId);
    if (episode.status === 'archive') {
      return res.status(400).json({ msg: '已归档，不可投票' });
    }
    // =====================================================

    const voted = await Vote.findOne({
      where: { UserId: req.user.id, RecommendId: recommendId }
    });
    if (voted) {
      return res.status(400).json({ msg: '你已给该歌曲投过票' });
    }

    const user = await User.findByPk(req.user.id);
    const maxVote = user.role === '文案' ? 1 : 3;

    if (num < 1 || num > maxVote) {
      return res.status(400).json({ msg: `最多投${maxVote}票` });
    }

    await Vote.create({
      UserId: req.user.id,
      EpisodeId: episodeId,
      RecommendId: recommendId,
      nickname: user.nickname,
      num: num
    });

    const song = await Recommend.findByPk(recommendId);
    await song.update({ voteCount: song.voteCount + num });

    res.json({ msg: '投票成功！' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '投票失败' });
  }
});

// 获取某歌曲的投票列表
router.get('/list/:songId', async (req, res) => {
  try {
    const list = await Vote.findAll({
      where: { RecommendId: req.params.songId }
    });
    res.json(list);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;