# 音乐推荐平台

## 开发说明

如果希望本地开发，通过Github拉取仓库到本地部署

```
git clone https://github.com/lishu620/music-vote.git
cd music-vote
npm install
```

如果是第一次开发，直接通过node.js进行开发

```
node ./backend/app.js
```

会自动生成database.sqlite文件作为数据库

如果需要对模块(modules)修改，重启开发服务器前需要删除数据库文件
## 部署说明

本平台基于Docker部署，在VPS上使用如下方式：
### 第一次部署

```
git clone https://github.com/lishu620/music-vote.git
cd music-vote
docker compose up -d --build
```

### 更新部署

在开发完成后，将代码上传到Github，通过如下方式更新

```
cd music-vote
git pull
docker compose down && docker compose up -d --build
```