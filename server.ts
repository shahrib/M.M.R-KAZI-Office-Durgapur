import app from "./api/index.js";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  // Serve logo.png from root directory if it exists
  app.get("/logo.png", (req, res, next) => {
    const logoPath = path.join(process.cwd(), 'logo.png');
    res.sendFile(logoPath, { maxAge: '1y' }, (err) => {
      if (err) {
        // If not found in root, let Vite or static middleware handle it (e.g. if it's in public/)
        next();
      }
    });
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
    app.use(express.static(distPath, { maxAge: '1y' }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
