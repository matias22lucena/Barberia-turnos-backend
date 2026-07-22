import { Router } from "express";
import { obtenerBarberos } from "../controllers/barberos.controller.js";

const router = Router();

router.get("/", obtenerBarberos);

export default router;