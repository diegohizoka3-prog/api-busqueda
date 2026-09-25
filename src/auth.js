const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ADMIN_USER = process.env.ADMIN_USER || 'elyon';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || '';
const JWT_SECRET = process.env.JWT_SECRET || 'cambiar-en-produccion';
const COOKIE_NAME = 'admin_token';

function login(usuario, password) {
  if (usuario !== ADMIN_USER) return null;

  if (ADMIN_PASS_HASH) {
    if (!bcrypt.compareSync(password, ADMIN_PASS_HASH)) return null;
  } else {
    const plainPass = process.env.ADMIN_PASS || 'admin2026';
    if (password !== plainPass) return null;
  }

  return jwt.sign({ user: usuario, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

function verificarToken(req, res, next) {
  const token = req.cookies[COOKIE_NAME] || req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { login, verificarToken, COOKIE_NAME };
