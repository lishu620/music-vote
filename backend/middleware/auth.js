const jwt = require('jsonwebtoken');
const secret = 'demo_123456';

const auth = (req, res, next) => {
  const token = req.header('x-token');
  if (!token) return res.status(401).json({ msg: '请登录' });
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: '登录已过期' });
  }
};

const roleAllowed = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: '无权限' });
    }
    next();
  };
};

module.exports = { auth, roleAllowed, secret };