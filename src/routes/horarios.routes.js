import { Router } from "express";
import { obtenerHorarios } from "../controllers/horarios.controller.js";

const router = Router();

router.get("/", obtenerHorarios);

export default router;