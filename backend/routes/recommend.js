const express = require('express');
const router = express.Router();
const { auth, roleAllowed } = require('../middleware/auth');
const Recommend = require('../models/Recommend');
const User = require('../models/User');

// 推荐歌曲（仅文案）
router.post('/add', auth, roleAllowed(['文案']), async (req, res) => {
  const { episodeId, type, link, reason } = req.body;

  const user = await User.findByPk(req.user.id);

  const rec = await Recommend.create({
    UserId: req.user.id,
    EpisodeId: episodeId,
    username: user.username,
    nickname: user.nickname,
    type, link, reason
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

module.exports = router;