#!/usr/bin/env node
// Usage: node backend/scripts/create-admin.js <email> <password> [name]
// Falls back to values in backend/.env (ADMIN_EMAIL, ADMIN_PASS, ADMIN_NAME)

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sivakasicracker';
const argv = process.argv.slice(2);
const email = argv[0] || process.env.ADMIN_EMAIL || 'admin@example.com';
const password = argv[1] || process.env.ADMIN_PASS || 'Admin@123';
const name = argv[2] || process.env.ADMIN_NAME || 'Admin User';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      mobile: String,
      password: String,
      role: { type: String, enum: ['user','admin'], default: 'user' },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const existing = await User.findOne({ email });
    const hashed = await bcrypt.hash(password, 12);

    if (existing) {
      existing.role = 'admin';
      existing.password = hashed;
      await existing.save();
      console.log(`Updated existing user ${email} -> role=admin`);
    } else {
      await User.create({ name, email, mobile: '', password: hashed, role: 'admin' });
      console.log(`Created admin user ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
