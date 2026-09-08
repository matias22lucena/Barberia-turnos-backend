import { Router } from "express";

import {
  obtenerPerfilAdministrador,
} from "../controllers/admin.controller.js";

import {
  cambiarEstadoTurnoAdministrador,
  listarTurnosAdministrador,
} from "../controllers/admin-turnos.controller.js";

import {
  actualizarServicioAdministrador,
  crearServicioAdministradorController,
  obtenerServiciosAdministrador,
} from "../controllers/admin-servicios.controller.js";

import {
  actualizarHorarioAdministrador,
  crearHorarioAdministradorController,
  eliminarHorarioAdministradorController,
  obtenerHorariosAdministrador,
} from "../controllers/admin-horarios.controller.js";

import {
  actualizarPromocionAdministrador,
  crearPromocionAdministradorController,
  eliminarPromocionAdministradorController,
  obtenerPromocionesAdministrador,
} from "../controllers/admin-promociones.controller.js";

import {
  verificarAdministrador,
} from "../middlewares/auth.middleware.js";

const router = Router();

/*
 * Todas las rutas definidas después
 * de este middleware requieren
 * un JWT administrativo válido.
 */
router.use(
  verificarAdministrador
);

/* PERFIL */

router.get(
  "/perfil",
  obtenerPerfilAdministrador
);

/* TURNOS */

router.get(
  "/turnos",
  listarTurnosAdministrador
);

router.patch(
  "/turnos/:id/estado",
  cambiarEstadoTurnoAdministrador
);

/* SERVICIOS */

router.get(
  "/servicios",
  obtenerServiciosAdministrador
);

router.post(
  "/servicios",
  crearServicioAdministradorController
);

router.patch(
  "/servicios/:id",
  actualizarServicioAdministrador
);

/* HORARIOS */

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

/* PROMOCIONES */

router.get(
  "/promociones",
  obtenerPromocionesAdministrador
);

router.post(
  "/promociones",
  crearPromocionAdministradorController
);

router.patch(
  "/promociones/:id",
  actualizarPromocionAdministrador
);

router.delete(
  "/promociones/:id",
  eliminarPromocionAdministradorController
);

export default router;