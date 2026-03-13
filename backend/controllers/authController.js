const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(`Attempting signup for: ${email}`);
    
    let user = await User.findByEmail(email);
    if (user) {
      console.log(`Signup failed: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({ name, email, password, role });
    console.log(`Signup successful for: ${email}`);
    
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Signup controller error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
