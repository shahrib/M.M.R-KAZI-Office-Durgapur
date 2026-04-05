import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kazi-office";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-kazi-key";

// MongoDB Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" }
});

const User = mongoose.model("User", userSchema);

// Predefined Admins
const ADMINS = [
  {
    name: "Kazi Office",
    email: "kaziofficedurgapur@gmail.com",
    password: "Tousif@#2345"
  },
  {
    name: "Tousif Ahamed",
    email: "ahamedtousif6290@gmail.com",
    password: "Tousif@#2345"
  }
];

async function seedAdmins() {
  for (const admin of ADMINS) {
    const exists = await User.findOne({ email: admin.email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await User.create({ ...admin, password: hashedPassword });
      console.log(`Admin seeded: ${admin.email}`);
    }
  }
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    await seedAdmins();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.json({ 
        user: { 
          id: user._id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        } 
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/me", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
