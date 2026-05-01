const { registerUser, loginUser } = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ message: 'Register successful', ...result });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.json({ message: 'Login successful', ...result });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful on client side. Remove token in frontend.' });
};