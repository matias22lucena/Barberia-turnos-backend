import {
  crearImagenCarruselAdmin,
  editarImagenCarruselAdmin,
  eliminarImagenCarruselAdmin,
  listarCarruselAdmin,
} from "../services/admin-carrusel.service.js";

export const obtenerCarruselAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const imagenes =
        await listarCarruselAdmin();

      res.status(200).json({
        ok: true,
        data: imagenes,
      });
    } catch (error) {
      next(error);
    }
  };

export const crearImagenCarruselAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const imagen =
        await crearImagenCarruselAdmin({
          archivo:
            req.file,

          titulo:
            req.body?.titulo,

          orden:
            req.body?.orden,

          activo:
            req.body?.activo,
        });

      res.status(201).json({
        ok: true,

        message:
          "Imagen agregada correctamente",

        data:
          imagen,
      });
    } catch (error) {
      next(error);
    }
  };

export const actualizarImagenCarruselAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const imagen =
        await editarImagenCarruselAdmin({
          imagenId:
            req.params.id,

          archivo:
            req.file,

          titulo:
            req.body?.titulo,

          orden:
            req.body?.orden,

          activo:
            req.body?.activo,
        });

      res.status(200).json({
        ok: true,

        message:
          "Imagen actualizada correctamente",

        data:
          imagen,
      });
    } catch (error) {
      next(error);
    }
  };

export const eliminarImagenCarruselAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      await eliminarImagenCarruselAdmin(
        req.params.id
      );

      res.status(200).json({
        ok: true,

        message:
          "Imagen eliminada correctamente",
      });
    } catch (error) {
      next(error);
    }
  };