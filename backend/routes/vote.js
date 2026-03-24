const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Recommend = require('../models/Recommend');
const User = require('../models/User');

// 投票接口（修改为：每首歌可投一次）
router.post('/do', auth, async (req, res) => {
  try {
    const { episodeId, recommendId, num } = req.body;

    // 🔥 关键修改：判断是否给【这首歌】投过，而不是本期
    const voted = await Vote.findOne({
      where: {
        UserId: req.user.id,
        RecommendId: recommendId // 只判断这首歌
      }
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
    await song.update({
      voteCount: song.voteCount + num
    });

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