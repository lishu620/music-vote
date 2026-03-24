const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Recommend = require('../models/Recommend');
const User = require('../models/User');

// 投票接口
router.post('/do', auth, async (req, res) => {
  try {
    const { episodeId, recommendId, num } = req.body;

    const user = await User.findByPk(req.user.id);

    // 单首歌投票上限（按角色）
    const maxSingleVote = user.role === '文案' ? 1 : 3;

    // 校验：单次投票数量不能超过单首歌上限
    if (num < 1 || num > maxSingleVote) {
      return res.status(400).json({
        msg: `投票失败！单首歌最多投 ${maxSingleVote} 票`
      });
    }

    const existingVote = await Vote.findOne({
      where: {
        UserId: req.user.id,
        EpisodeId: episodeId,
        RecommendId: recommendId
      }
    });

    if (existingVote) {
      return res.status(400).json({
        msg: '你已经给这首歌曲投过票，无法重复投票'
      });
    }

    // 创建投票记录
    await Vote.create({
      UserId: req.user.id,
      EpisodeId: episodeId,
      RecommendId: recommendId,
      nickname: user.nickname,
      num: num
    });

    // 累加歌曲票数
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