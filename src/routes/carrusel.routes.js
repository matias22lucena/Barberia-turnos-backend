import {
  Router,
} from "express";

import {
  obtenerCarrusel,
} from "../controllers/carrusel.controller.js";

const router =
  Router();

router.get(
  "/",
  obtenerCarrusel
);

export default router;