import {
  Router,
} from "express";

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
  actualizarImagenCarruselAdministrador,
  crearImagenCarruselAdministrador,
  eliminarImagenCarruselAdministrador,
  obtenerCarruselAdministrador,
} from "../controllers/admin-carrusel.controller.js";

import {
  actualizarContenidoHomeAdministrador,
  actualizarImagenHomeAdministrador,
  eliminarImagenHomeAdministrador,
  obtenerContenidoHomeAdministrador,
} from "../controllers/admin-home-contenido.controller.js";

import {
  verificarAdministrador,
} from "../middlewares/auth.middleware.js";

import {
  uploadCarrusel,
} from "../middlewares/carrusel-upload.middleware.js";

import {
  uploadHome,
} from "../middlewares/home-upload.middleware.js";

const router =
  Router();

/*
 * TODO LO QUE ESTÉ DEBAJO
 * REQUIERE JWT DE ADMINISTRADOR.
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

/* CARRUSEL */

router.get(
  "/carrusel",
  obtenerCarruselAdministrador
);

router.post(
  "/carrusel",
  uploadCarrusel.single(
    "imagen"
  ),
  crearImagenCarruselAdministrador
);

router.patch(
  "/carrusel/:id",
  uploadCarrusel.single(
    "imagen"
  ),
  actualizarImagenCarruselAdministrador
);

router.delete(
  "/carrusel/:id",
  eliminarImagenCarruselAdministrador
);

/* CONTENIDO DEL HOME */

router.get(
  "/home-contenido",
  obtenerContenidoHomeAdministrador
);

router.patch(
  "/home-contenido",
  actualizarContenidoHomeAdministrador
);

router.post(
  "/home-contenido/imagen",
  uploadHome.single(
    "imagen"
  ),
  actualizarImagenHomeAdministrador
);

router.delete(
  "/home-contenido/imagen",
  eliminarImagenHomeAdministrador
);

export default router;