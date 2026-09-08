import {
  crearServicioAdministrador,
  editarServicioAdmin,
  listarServiciosAdmin,
} from "../services/admin-servicios.service.js";

export const obtenerServiciosAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const servicios =
        await listarServiciosAdmin();

      res.status(200).json({
        ok: true,
        data: servicios,
      });
    } catch (error) {
      next(error);
    }
  };

export const crearServicioAdministradorController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const servicio =
        await crearServicioAdministrador({
          nombre:
            req.body?.nombre,

          descripcion:
            req.body?.descripcion,

          duracionMinutos:
            req.body
              ?.duracionMinutos,

          precio:
            req.body?.precio,

          activo:
            req.body?.activo,
        });

      res.status(201).json({
        ok: true,
        message:
          "Servicio creado correctamente",
        data: servicio,
      });
    } catch (error) {
      next(error);
    }
  };

export const actualizarServicioAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const servicio =
        await editarServicioAdmin({
          servicioId:
            req.params.id,

          nombre:
            req.body?.nombre,

          descripcion:
            req.body?.descripcion,

          duracionMinutos:
            req.body
              ?.duracionMinutos,

          precio:
            req.body?.precio,

          activo:
            req.body?.activo,
        });

      res.status(200).json({
        ok: true,
        message:
          "Servicio actualizado correctamente",
        data: servicio,
      });
    } catch (error) {
      next(error);
    }
  };