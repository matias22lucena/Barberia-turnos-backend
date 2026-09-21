import {
  Router,
} from "express";

import {
  obtenerContenidoHomePublico,
} from "../controllers/home-contenido.controller.js";

const router =
  Router();

router.get(
  "/",
  obtenerContenidoHomePublico
);

export default router;