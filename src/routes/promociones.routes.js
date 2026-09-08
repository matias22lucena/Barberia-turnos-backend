import { Router } from "express";

import {
  obtenerPromociones,
} from "../controllers/promociones.controller.js";

const router = Router();

router.get("/", obtenerPromociones);

export default router;