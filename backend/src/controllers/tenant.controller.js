const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');

exports.getTenants = async (req, res, next) => {
  try {
    const tenants = await User.find({ role: 'user' }).select('-password').populate('roomId', 'roomNumber building floor');
    res.json({ tenants });
  } catch (error) {
    next(error);
  }
};

exports.createTenant = async (req, res, next) => {
  try {
    const { name, email, password, phone, roomId, startDate } = req.body;
    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const tenant = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      roomId: roomId || null,
      startDate: startDate || null,
      role: 'user'
    });

    if (roomId) {
      await Room.findByIdAndUpdate(roomId, { tenantId: tenant._id, status: 'occupied' });
    }

    const safeTenant = tenant.toObject();
    delete safeTenant.password;

    res.status(201).json({ message: 'Tenant created', tenant: safeTenant });
  } catch (error) {
    next(error);
  }
};

exports.getTenantById = async (req, res, next) => {
  try {
    const tenant = await User.findOne({ _id: req.params.id, role: 'user' }).select('-password').populate('roomId');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({ tenant });
  } catch (error) {
    next(error);
  }
};

exports.updateTenant = async (req, res, next) => {
  try {
    const { roomId, password, ...rest } = req.body;
    const tenant = await User.findOne({ _id: req.params.id, role: 'user' });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (tenant.roomId && String(tenant.roomId) !== String(roomId || '')) {
      await Room.findByIdAndUpdate(tenant.roomId, { tenantId: null, status: 'vacant' });
    }

    if (roomId) {
      await Room.findByIdAndUpdate(roomId, { tenantId: tenant._id, status: 'occupied' });
      tenant.roomId = roomId;
    } else {
      tenant.roomId = null;
    }

    Object.assign(tenant, rest);

    if (password && password.trim()) {
      tenant.password = await bcrypt.hash(password.trim(), 10);
    }

    await tenant.save();

    const safeTenant = tenant.toObject();
    delete safeTenant.password;

    res.json({ message: 'Tenant updated', tenant: safeTenant });
  } catch (error) {
    next(error);
  }
};

exports.deleteTenant = async (req, res, next) => {
  try {
    const tenant = await User.findOne({ _id: req.params.id, role: 'user' });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (tenant.roomId) {
      await Room.findByIdAndUpdate(tenant.roomId, { tenantId: null, status: 'vacant' });
    }

    tenant.isActive = false;
    tenant.roomId = null;
    await tenant.save();

    res.json({ message: 'Tenant deactivated' });
  } catch (error) {
    next(error);
  }
};
exports.toggleTenantStatus = async (req, res, next) => {
  try {
    const tenant = await User.findOne({ _id: req.params.id, role: 'user' });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (tenant.isActive) {
      if (tenant.roomId) {
        await Room.findByIdAndUpdate(tenant.roomId, {
          tenantId: null,
          status: 'vacant',
        });
      }

      tenant.isActive = false;
      tenant.roomId = null;

      await tenant.save();

      const safeTenant = tenant.toObject();
      delete safeTenant.password;

      return res.json({
        message: 'ປິດການໃຊ້ງານສຳເລັດ',
        tenant: safeTenant,
      });
    }

    tenant.isActive = true;
    await tenant.save();

    const safeTenant = tenant.toObject();
    delete safeTenant.password;

    return res.json({
      message: 'ເປີດການໃຊ້ງານສຳເລັດ',
      tenant: safeTenant,
    });
  } catch (error) {
    next(error);
  }
};