// ============================================================
// SIVAKASI CRACKERS - Complete Backend Server
// Node.js + Express + MongoDB + Razorpay + JWT
// Security & High-Concurrency (1000 req/s) Ready
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
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cluster = require("cluster");
const os = require("os");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// SECURITY & PERFORMANCE MIDDLEWARE
// ============================================================

// 1. Helmet HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// 2. Response Body Compression (gzip)
app.use(compression());

// 3. Mongo Operator Injection Protection
app.use(mongoSanitize({ replaceWith: "_" }));

// 4. HTTP Parameter Pollution Protection
app.use(hpp());

// 5. Strict CORS Configuration
const allowedOrigins = [
  "https://www.rambalajishop.shop",
  "https://rambalajishop.shop",
  "https://ram-balaji-shop.vercel.app",
  "https://ram-balaji-admin.vercel.app",
// https://ecom-mocha-two.vercel.app/
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:4001",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*") || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error("CORS Policy Violation: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 6. Multi-Tier Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many authentication attempts. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login-shop", authLimiter);
app.use("/api/auth/login-admin", authLimiter);
app.use("/api/auth/register", authLimiter);

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many transaction requests. Please wait a few minutes before trying again." },
});
app.use("/api/payment/", orderLimiter);
app.use("/api/orders/cod", orderLimiter);

// 7. Micro-Caching Layer for High-Volume Queries (1000 req/s load reduction)
const cacheStore = new Map();
const cacheMiddleware = (durationSeconds = 5) => {
  return (req, res, next) => {
    if (req.method !== "GET" || req.headers.authorization) {
      return next();
    }
    const key = req.originalUrl || req.url;
    const cached = cacheStore.get(key);
    if (cached && Date.now() < cached.expireAt) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached.data);
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cacheStore.set(key, {
        data,
        expireAt: Date.now() + durationSeconds * 1000,
      });
      res.setHeader("X-Cache", "MISS");
      return originalJson(data);
    };
    next();
  };
};

const clearCache = () => cacheStore.clear();

// Validation Error Handler Helper
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

// ============================================================
// DATABASE CONNECTION & HIGH-CONCURRENCY POOLING
// ============================================================
let isReady = false;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sivakasicracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 100, // Handle up to 100 concurrent DB queries per process
  minPoolSize: 10,  // Keep warm connections ready
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
}).then(() => {
  console.log("✅ MongoDB connected with high-concurrency pool (maxPoolSize: 100)");
  isReady = true;
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
  // We keep isReady false if DB fails, so health checks reflect unreadiness
});

// ============================================================
// SCHEMAS & MODELS
// ============================================================

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, sparse: true, lowercase: true },
  mobile: { type: String, index: { unique: true, sparse: true } },
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");
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
app.post(
  "/api/auth/register",
  [
    body("name").notEmpty().withMessage("Name is required").trim().escape(),
    body("mobile").notEmpty().withMessage("Mobile number is required").trim(),
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address").normalizeEmail(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      let { name, email, mobile } = req.body;

      if (email === "") email = undefined;

      const mobileExists = await User.findOne({ mobile });
      if (mobileExists) return res.status(400).json({ error: "Mobile number already registered. Please login." });

      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ error: "Email address already registered. Please login or use another email." });
      }

      const user = await User.create({ name, email, mobile });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "default_jwt_secret_key", { expiresIn: "7d" });
      res.json({ token, user: { id: user._id, name, email: user.email, mobile, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
    }
  }
);

app.post(
  "/api/auth/login-shop",
  [
    body("mobile").notEmpty().withMessage("Mobile number is required").trim(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { mobile } = req.body;
      const user = await User.findOne({ mobile });
      if (!user) return res.status(400).json({ error: "User not found" });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "default_jwt_secret_key", { expiresIn: "7d" });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
    }
  }
);

app.post(
  "/api/auth/login-admin",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.role !== "admin") return res.status(400).json({ error: "Invalid admin credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid admin credentials" });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "default_jwt_secret_key", { expiresIn: "7d" });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
    }
  }
);

app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ============================================================
// PRODUCT ROUTES
// ============================================================
app.get("/api/products", cacheMiddleware(5), async (req, res) => {
  try {
    const {
      category,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Validate pagination
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const perPage = Math.min(
      Math.max(parseInt(limit, 10) || 12, 1),
      200
    );

    // Build query
    const query = {
      isActive: true,
    };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search && search.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Build sort
    let sortObj = {};

    if (sort === "low") {
      sortObj = { price: 1 };
    } else if (sort === "high") {
      sortObj = { price: -1 };
    } else {
      // Default sorting
      sortObj = { createdAt: -1 };
    }

    // Count products
    const total = await Product.countDocuments(query);

    // Fetch products
    const products = await Product.find(query)
      .sort(sortObj)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean();

    res.status(200).json({
      products,
      total,
      pages: Math.ceil(total / perPage),
      page: currentPage,
      limit: perPage,
    });
  } catch (err) {
    console.error("GET /api/products error:", err);

    res.status(500).json({
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
  }
});

// Admin: CRUD Products (Clears Micro-Cache)
app.post("/api/admin/products", adminAuth, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, category, price, mrp, discount, stock } = req.body;
    const images = req.files?.map(f => f.path) || [];
    const product = await Product.create({ name, description, category, price, mrp, discount, stock, images });
    clearCache();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
  }
});

app.put("/api/admin/products/:id", adminAuth, upload.array("images", 5), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.length) updates.images = req.files.map(f => f.path);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    clearCache();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
  }
});

app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  clearCache();
  res.json({ success: true });
});

// ============================================================
// COUPON ROUTES
// ============================================================
app.post(
  "/api/coupons/validate",
  [
    body("code").notEmpty().withMessage("Coupon code is required").trim().escape(),
    body("subtotal").isNumeric().withMessage("Subtotal must be a number"),
  ],
  validateRequest,
  async (req, res) => {
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
      res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
    }
  }
);

app.get("/api/admin/coupons", adminAuth, async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

app.post("/api/admin/coupons", adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
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
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
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

    for (const it of order.items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty, salesCount: it.qty } });
    }
    clearCache();

    await User.findByIdAndUpdate(req.user.id, {
      address: orderData.customer.address,
      city: orderData.customer.city,
      state: orderData.customer.state,
      pincode: orderData.customer.pincode
    }).catch(() => { });

    res.json({ success: true, orderId: order.orderId });
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
  }
});

// COD Order (Disabled for Firecrackers)
app.post("/api/orders/cod", auth, async (req, res) => {
  return res.status(400).json({
    error: "Cash on Delivery (COD) is not available for firecracker orders due to safety & logistics rules. Please complete your payment via GPay or Razorpay Online Payment."
  });
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
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
  }
});

app.put("/api/admin/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate({ orderId: req.params.id }, { status, updatedAt: new Date() }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
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
    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
  }
});

// Admin: Users
app.get("/api/admin/users", adminAuth, async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// Admin: Banners
app.get("/api/banners", cacheMiddleware(10), async (req, res) => {
  const banners = await Banner.find({ isActive: true });
  res.json(banners);
});

app.post("/api/admin/banners", adminAuth, async (req, res) => {
  const banner = await Banner.create(req.body);
  clearCache();
  res.json(banner);
});

app.delete("/api/admin/banners/:id", adminAuth, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  clearCache();
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

// Lightweight health endpoint for Load Balancers & Render
app.get('/api/health', (req, res) => {
  if (!isReady) {
    return res.status(503).json({ ok: false, status: "starting" });
  }
  res.json({ ok: true, status: "ready", pid: process.pid });
});

// ============================================================
// ERROR HANDLING
// ============================================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : (err.message || "Internal server error");
  res.status(err.status || 500).json({ error: message });
});

// ============================================================
// CLUSTER & SERVER LAUNCH (Load Balancing Across CPU Cores)
// ============================================================
const maxRetries = 5;
let tryPort = Number(PORT);
let attempts = 0;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n🪔 Sivakasi Backend Worker PID ${process.pid} Running!\n📡 Port: ${port}\n🌐 API: http://localhost:${port}/api\n🔒 Helmet & Mongo Sanitizer enabled\n⚡ Response Compression enabled\n💳 Razorpay integrated\n`);
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

// Multi-Core Cluster Execution (when ENABLE_CLUSTER=true or production multi-core)
const numCPUs = process.env.WEB_CONCURRENCY ? parseInt(process.env.WEB_CONCURRENCY, 10) : os.cpus().length;

if (cluster.isPrimary && process.env.ENABLE_CLUSTER === "true" && numCPUs > 1) {
  console.log(`🚀 Primary Cluster Process PID ${process.pid} running. Load balancing across ${numCPUs} CPU cores...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.warn(`Worker PID ${worker.process.pid} died (${signal || code}). Launching replacement worker...`);
    cluster.fork();
  });
} else {
  startServer(tryPort);
}

// Self-ping for cloud deployments
const selfPing = () => {
  const URL = process.env.API_URL || "https://ecom-rne9.onrender.com";
  if (!URL) return;

  require("https").get(`${URL}/api/health`, (res) => {
    console.log(`[Self-Ping] Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`[Self-Ping] Error: ${err.message}`);
  });
};

const FIVE_MINUTES = 5 * 60 * 1000;
setTimeout(() => {
  selfPing();
  setInterval(selfPing, FIVE_MINUTES);
}, 30000);

module.exports = app;

