import express from "express";
import cors from "cors";
import helmet from "helmet";

import pool from "./config/database.js";

import serviciosRoutes from "./routes/servicios.routes.js";
import promocionesRoutes from "./routes/promociones.routes.js";
import barberosRoutes from "./routes/barberos.routes.js";
import horariosRoutes from "./routes/horarios.routes.js";
import disponibilidadRoutes from "./routes/disponibilidad.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";
import carruselRoutes from "./routes/carrusel.routes.js";
import homeContenidoRoutes from "./routes/home-contenido.routes.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import {
  notFoundHandler,
} from "./middlewares/notFound.middleware.js";

import {
  errorHandler,
} from "./middlewares/error.middleware.js";

const app =
  express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy:
        "cross-origin",
    },
  })
);

const origenesPermitidos = [
  "http://localhost:5173",
  "http://192.168.100.17:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: origenesPermitidos,
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

/*
 * Imágenes subidas desde administración.
 */
/* app.use(
  "/uploads",
  express.static(
    "uploads"
  )
); */

app.get(
  "/api/health",
  async (
    req,
    res
  ) => {
    try {
      await pool.query(
        "SELECT 1"
      );

      res.status(
        200
      ).json({
        ok: true,

        message:
          "API y MariaDB funcionando correctamente",

        database:
          "connected",
      });
    } catch (error) {
      res.status(
        503
      ).json({
        ok: false,

        message:
          "La API funciona, pero MariaDB no está disponible",

        database:
          "disconnected",
      });
    }
  }
);

/* ========================= */
/* RUTAS PÚBLICAS */
/* ========================= */

app.use(
  "/api/servicios",
  serviciosRoutes
);

app.use(
  "/api/promociones",
  promocionesRoutes
);

app.use(
  "/api/barberos",
  barberosRoutes
);

app.use(
  "/api/horarios",
  horariosRoutes
);

app.use(
  "/api/disponibilidad",
  disponibilidadRoutes
);

app.use(
  "/api/turnos",
  turnosRoutes
);

app.use(
  "/api/carrusel",
  carruselRoutes
);

app.use(
  "/api/home-contenido",
  homeContenidoRoutes
);

/* ========================= */
/* AUTENTICACIÓN Y ADMIN */
/* ========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

/* ========================= */
/* ERRORES */
/* ========================= */

app.use(
  notFoundHandler
);

app.use(
  errorHandler
);

export default app;