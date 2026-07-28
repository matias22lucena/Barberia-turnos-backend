import { Router } from "express";
import { obtenerHorariosDisponibles } from "../controllers/disponibilidad.controller.js";

const router = Router();

router.get("/", obtenerHorariosDisponibles);

export default router;