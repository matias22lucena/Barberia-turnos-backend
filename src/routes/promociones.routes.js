import { Router } from "express";

import {
  obtenerPromociones,
} from "../controllers/promociones.controller.js";

const router = Router();

/*
 * Ruta pública.
 * NO requiere token de administrador.
 */
router.get(
  "/",
  obtenerPromociones
);

export default router;