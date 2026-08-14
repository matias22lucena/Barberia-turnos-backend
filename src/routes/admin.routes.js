import { Router } from "express";

import { obtenerPerfilAdministrador } from "../controllers/admin.controller.js";

import {
  cambiarEstadoTurnoAdministrador,
  listarTurnosAdministrador,
} from "../controllers/admin-turnos.controller.js";

import {
  actualizarServicioAdministrador,
  obtenerServiciosAdministrador,
} from "../controllers/admin-servicios.controller.js";

import {
  actualizarHorarioAdministrador,
  crearHorarioAdministradorController,
  eliminarHorarioAdministradorController,
  obtenerHorariosAdministrador,
} from "../controllers/admin-horarios.controller.js";

import { verificarAdministrador } from "../middlewares/auth.middleware.js";

const router = Router();

/*
 * Todas las rutas definidas después de este middleware
 * requieren un JWT administrativo válido.
 */
router.use(verificarAdministrador);

router.get(
  "/perfil",
  obtenerPerfilAdministrador
);

router.get(
  "/turnos",
  listarTurnosAdministrador
);

router.patch(
  "/turnos/:id/estado",
  cambiarEstadoTurnoAdministrador
);
router.get(
  "/servicios",
  obtenerServiciosAdministrador
);

router.patch(
  "/servicios/:id",
  actualizarServicioAdministrador
);

router.get(
  "/horarios",
  obtenerHorariosAdministrador
);

router.post(
  "/horarios",
  crearHorarioAdministradorController
);

router.patch(
  "/horarios/:id",
  actualizarHorarioAdministrador
);

router.delete(
  "/horarios/:id",
  eliminarHorarioAdministradorController
);

export default router;