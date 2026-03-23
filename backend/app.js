const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/episode', require('./routes/episode'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/vote', require('./routes/vote'));

app.get('/', (req, res) => res.send('API运行中'));

const PORT = 3000;
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`服务器已启动：${PORT}，数据库持久化已开启`));
});