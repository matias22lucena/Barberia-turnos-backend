import {
  cambiarEstadoTurnoAdmin,
  obtenerTurnosAdmin,
} from "../services/admin-turnos.service.js";

export const listarTurnosAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const turnos =
        await obtenerTurnosAdmin(
          {
            fecha:
              req.query.fecha,

            estado:
              req.query.estado,
          }
        );

      res.status(
        200
      ).json({
        ok: true,

        data:
          turnos,
      });
    } catch (error) {
      next(error);
    }
  };

export const cambiarEstadoTurnoAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const turno =
        await cambiarEstadoTurnoAdmin(
          {
            turnoId:
              req.params.id,

            estado:
              req.body
                ?.estado,
          }
        );

      res.status(
        200
      ).json({
        ok: true,

        message:
          "Estado del turno actualizado correctamente",

        data:
          turno,
      });
    } catch (error) {
      next(error);
    }
  };