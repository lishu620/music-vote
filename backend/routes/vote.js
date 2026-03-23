const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Recommend = require('../models/Recommend');
const User = require('../models/User'); // 这里修复：引入User

// 投票接口
router.post('/do', auth, async (req, res) => {
  try {
    const { episodeId, recommendId, num } = req.body;

    // 1. 判断是否已经投过票
    const voted = await Vote.findOne({
      where: {
        UserId: req.user.id,
        EpisodeId: episodeId
      }
    });
    if (voted) {
      return res.status(400).json({ msg: '本期已投票，无法重复投' });
    }

    // 2. 查询当前用户（修复：这里必须查）
    const user = await User.findByPk(req.user.id);

    // 3. 角色投票限制
    const maxVote = user.role === '文案' ? 1 : 3;
    if (num < 1 || num > maxVote) {
      return res.status(400).json({ msg: `本期最多投${maxVote}票` });
    }

    // 4. 创建投票记录
    await Vote.create({
      UserId: req.user.id,
      EpisodeId: episodeId,
      RecommendId: recommendId,
      nickname: user.nickname,
      num: num
    });

    // 5. 累加票数
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

// 获取某歌曲的投票列表（显示昵称）
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