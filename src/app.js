import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/database.js";
import serviciosRoutes from "./routes/servicios.routes.js";
import barberosRoutes from "./routes/barberos.routes.js";
import horariosRoutes from "./routes/horarios.routes.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      ok: true,
      message: "API y MariaDB funcionando correctamente",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      message: "La API funciona, pero MariaDB no está disponible",
      database: "disconnected",
    });
  }
});

app.use("/api/servicios", serviciosRoutes);
app.use("/api/barberos", barberosRoutes);
app.use("/api/horarios", horariosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;