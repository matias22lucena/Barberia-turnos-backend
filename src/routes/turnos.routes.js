import { Router } from "express";
import { crearTurno } from "../controllers/turnos.controller.js";

const router = Router();

router.post("/", crearTurno);

export default router;