const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

async function registerUser(payload) {
  const { name, email, password, phone, role } = payload;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    role: role || 'user'
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  return {
    token: generateToken({ id: user._id, role: user.role }),
    user: safeUser
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 400;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('ບັນຊີຂອງທ່ານຖືກປິດການໃຊ້ງານ ກະລຸນາຕິດຕໍ່ເຈົ້າຂອງຫ້ອງເຊົ່າ');
    error.statusCode = 403;
    error.code = 'ACCOUNT_DISABLED';
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 400;
    throw error;
  }

  const safeUser = user.toObject();
  delete safeUser.password;

  return {
    token: generateToken({ id: user._id, role: user.role }),
    user: safeUser
  };
}

module.exports = {
  registerUser,
  loginUser
};