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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`端口：${PORT}`);
});

sequelize.sync({ force: false }).then(() => {
  console.log('数据库已同步');
});