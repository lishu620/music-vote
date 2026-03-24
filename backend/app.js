const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const path = require('path');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/episode', require('./routes/episode'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/vote', require('./routes/vote'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/comment', require('./routes/comment'));
app.get('/', (req, res) => res.send('API运行中'));

// 自动初始化管理员账号
async function initAdmin() {
  try {
    const exists = await User.findOne({ where: { username: 'admin' } });
    if (exists) {
      console.log('控制台：管理员账号已存在');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash('admin@123', salt);

    await User.create({
      username: 'admin',
      password: hashedPwd,
      nickname: '系统管理员',
      role: '管理',
      status: 'active'
    });
  } catch (err) {
    console.error('控制台：初始化管理员失败：', err);
  }
}

sequelize.sync({ force: false }).then(async () => {
  await initAdmin();
  console.log('控制台：数据库已同步');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`控制台：服务器运行在端口：${PORT}`);
});