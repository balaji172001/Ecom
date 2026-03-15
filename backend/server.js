// ============================================================
// SIVAKASI CRACKERS - Complete Backend Server
// Node.js + Express + MongoDB + Razorpay + JWT
// ============================================================

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// DATABASE CONNECTION
// ============================================================
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sivakasicracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("✅ MongoDB connected");
  try {
    // Force drop the old email index to let mongoose recreate it with 'sparse'
    // This is necessary because mongoose cannot change an index's 'sparse' property once created
    const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.collection('users').dropIndex('email_1').catch(e => console.log("Note: email index don't exist yet"));
      // Clean up any existing bad data that might block registration
      await mongoose.connection.db.collection('users').deleteMany({ $or: [{ email: null }, { email: "" }] });
      console.log("🧹 DB Cleanup: Removed users with empty emails and reset email index.");
    }
  } catch (err) {
    console.log("DB Prep info:", err.message);
  }
})
  .catch(err => console.error("❌ MongoDB error:", err));

// ============================================================
// SCHEMAS & MODELS
// ============================================================

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  mobile: { type: String, unique: true, required: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// Product Schema
// Note: category is intentionally free-form so we can import the full frontend price-list
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  images: [String],
  isActive: { type: Boolean, default: true },
  salesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model("Product", productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String, price: Number, qty: Number, image: String,
  }],
  customer: {
    name: String, mobile: String, email: String,
    address: String, city: String, state: String, pincode: String,
  },
  deliveryDate: Date,
  subtotal: Number,
  deliveryCharge: Number,
  discount: Number,
  total: Number,
  status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  paymentMethod: { type: String, enum: ["razorpay", "cod"] },
  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  coupon: { code: String, discount: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// Coupon Schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ["percent", "flat"], default: "percent" },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  uses: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
});
const Coupon = mongoose.model("Coupon", couponSchema);

// Banner Schema
const bannerSchema = new mongoose.Schema({
  title: String, subtitle: String, type: String,
  image: String, emoji: String, isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const Banner = mongoose.model("Banner", bannerSchema);

// ============================================================
// RAZORPAY SETUP (guarded)
// ============================================================
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  } catch (e) {
    console.warn("⚠️ Razorpay initialization failed:", e.message);
    razorpay = null;
  }
} else {
  console.warn("⚠️ Razorpay keys not set. Payment routes will be disabled.");
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const generateOrderId = () => "SIV" + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();

const sendEmail = async (to, subject, html) => {
  // If email creds are not configured, skip sending silently
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

const sendWhatsApp = async (mobile, message) => {
  // Twilio WhatsApp integration
  if (process.env.TWILIO_SID) {
    const client = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+91${mobile}`,
      body: message,
    });
  }
};

// ============================================================
// MIDDLEWARES
// ============================================================
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
    next();
  });
};

// ============================================================
// FILE UPLOAD (Cloudinary)
// ============================================================

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ============================================================
// AUTH ROUTES
// ============================================================
app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("📝 Registration Attempt:", req.body);
    let { name, email, mobile } = req.body;

    // Normalize data: Trim and remove spaces from mobile
    if (name) name = name.trim();
    if (mobile) mobile = mobile.trim().replace(/\s+/g, "");
    if (email) email = email.trim().toLowerCase();

    if (!name || !mobile)
      return res.status(400).json({ error: "Name and Mobile number are required" });

    // Clean empty strings for optional fields
    if (!email || email === "") email = undefined;

    // Check if user exists by mobile
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) return res.status(400).json({ error: "Mobile number already registered. Please login." });

    const userData = { name, mobile };
    if (email) userData.email = email;
    const user = await User.create(userData);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env!");
      throw new Error("Server configuration error (JWT)");
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "70d" });
    res.json({ token, user: { id: user._id, name, email: user.email, mobile, role: user.role } });
  } catch (err) {
    console.error("❌ Registration Error Detail:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
      body: req.body
    });
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "Unknown field";
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different one.` });
    }
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
      type: err.name
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    let { mobile } = req.body;
    console.log("🔑 Login Attempt:", { original: req.body.mobile, processed: mobile });
    if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

    // Normalize mobile: Trim and remove spaces
    mobile = mobile ? mobile.trim().replace(/\s+/g, "") : "";
    console.log("🔑 Login Attempt (Processed):", mobile);

    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ error: "User not found. Please register first." });

    // Auto-login with just mobile (Simplification as requested)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "70d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login-admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") return res.status(400).json({ error: "Invalid admin credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid admin credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ============================================================
// PRODUCT ROUTES
// ============================================================
app.get("/api/products", async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category && category !== "All") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    let sortObj = {};
    if (sort === "low") sortObj.price = 1;
    else if (sort === "high") sortObj.price = -1;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip((page - 1) * limit).limit(+limit);

    res.json({ products, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: CRUD
app.post("/api/admin/products", adminAuth, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, category, price, mrp, discount, stock } = req.body;
    const images = req.files?.map(f => f.path) || [];
    const product = await Product.create({ name, description, category, price, mrp, discount, stock, images });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/products/:id", adminAuth, upload.array("images", 5), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.length) updates.images = req.files.map(f => f.path);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ============================================================
// COUPON ROUTES
// ============================================================
app.post("/api/coupons/validate", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(400).json({ error: "Invalid coupon" });
    if (coupon.uses >= coupon.maxUses) return res.status(400).json({ error: "Coupon exhausted" });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ error: "Coupon expired" });
    if (subtotal < coupon.minOrder) return res.status(400).json({ error: `Minimum order \u20B9${coupon.minOrder} required` });

    const discount = coupon.type === "percent" ? Math.round(subtotal * coupon.value / 100) : coupon.value;
    res.json({ valid: true, discount, code, type: coupon.type, value: coupon.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/coupons", adminAuth, async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

app.post("/api/admin/coupons", adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/coupons/:id", adminAuth, async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
});

app.delete("/api/admin/coupons/:id", adminAuth, async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ============================================================
// RAZORPAY PAYMENT ROUTES
// ============================================================
app.post("/api/payment/create-order", auth, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: "Razorpay not configured" });
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100,
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: { userId: req.user.id },
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payment/verify", auth, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: "Razorpay not configured" });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated = hmac.digest("hex");
    if (generated !== razorpay_signature) return res.status(400).json({ success: false, error: "Invalid signature" });

    // create order in DB
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      user: req.user.id,
      items: orderData.items,
      customer: orderData.customer,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      discount: orderData.discount,
      total: orderData.total,
      paymentMethod: "razorpay",
      payment: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: "paid" },
      status: "Confirmed",
    });

    // update product stock & sales
    for (const it of order.items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty, salesCount: it.qty } });
    }

    // update user address
    await User.findByIdAndUpdate(req.user.id, {
      address: orderData.customer.address,
      city: orderData.customer.city,
      state: orderData.customer.state,
      pincode: orderData.customer.pincode
    }).catch(() => { });

    res.json({ success: true, orderId: order.orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COD Order
app.post("/api/orders/cod", auth, async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      user: req.user.id,
      items: orderData.items,
      customer: orderData.customer,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      discount: orderData.discount,
      total: orderData.total,
      paymentMethod: "cod",
      payment: { status: "pending" },
      status: "Pending",
    });

    for (const it of order.items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty, salesCount: it.qty } });
    }

    sendEmail(order.customer.email, "Order Placed", `<p>Your COD order ${order.orderId} is placed.</p>`).catch(() => { });
    sendWhatsApp(order.customer.mobile, `Your COD order ${order.orderId} is placed.`).catch(() => { });

    res.json({ success: true, orderId: order.orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ORDER ROUTES
// ============================================================
app.get("/api/orders/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("items.product", "name images");
  res.json(orders);
});

app.get("/api/orders/:id", auth, async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

// Admin order routes
app.get("/api/admin/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate({ orderId: req.params.id }, { status, updatedAt: new Date() }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ADMIN DASHBOARD
// ============================================================
app.get("/api/admin/dashboard", adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([{ $match: { status: { $ne: "Cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const lowStock = await Product.find({ stock: { $lt: 5 } }).countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

    res.json({ totalOrders, totalRevenue, lowStock, recentOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Users
app.get("/api/admin/users", adminAuth, async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// Admin: Banners
app.get("/api/banners", async (req, res) => {
  const banners = await Banner.find({ isActive: true });
  res.json(banners);
});

app.post("/api/admin/banners", adminAuth, async (req, res) => {
  const banner = await Banner.create(req.body);
  res.json(banner);
});

app.delete("/api/admin/banners/:id", adminAuth, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ============================================================
// EXPORT ORDERS TO CSV
// ============================================================
app.get("/api/admin/orders/export", adminAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  const rows = [["Order ID", "Customer", "Mobile", "City", "Total", "Items", "Payment", "Status", "Date"]];
  orders.forEach(o => rows.push([
    o.orderId, o.customer.name, o.customer.mobile, o.customer.city,
    o.total, o.items.length, o.paymentMethod, o.status,
    o.createdAt.toISOString().split("T")[0]
  ]));
  const csv = rows.map(r => r.join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
  res.send(csv);
});

// ============================================================
// ERROR HANDLING
// ============================================================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Health endpoint — shows server + DB connection status
app.get('/api/health', async (req, res) => {
  const mongooseState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  res.json({ ok: true, dbState: mongooseState });
});

// ============================================================
// START SERVER with port fallback if in use
// ============================================================
const maxRetries = 5;
let tryPort = Number(PORT);
let attempts = 0;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n🪔 Sivakasi Crackers Backend Running!\n📡 Port: ${port}\n🌐 API: http://localhost:${port}/api\n🔒 JWT Auth enabled\n💳 Razorpay integrated\n📧 Email notifications ready\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < maxRetries) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      attempts += 1;
      tryPort = port + 1;
      setTimeout(() => startServer(tryPort), 200);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });
};

startServer(tryPort);

module.exports = app;
