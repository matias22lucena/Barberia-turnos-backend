import {
  cambiarImagenHomeAdmin,
  editarContenidoHomeAdmin,
  listarContenidoHomeAdmin,
  quitarImagenHomeAdmin,
} from "../services/admin-home-contenido.service.js";

export const obtenerContenidoHomeAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const contenido =
        await listarContenidoHomeAdmin();

      res.status(200).json({
        ok: true,
        data: contenido,
      });
    } catch (error) {
      next(error);
    }
  };

export const actualizarContenidoHomeAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const contenido =
        await editarContenidoHomeAdmin(
          req.body
        );

      res.status(200).json({
        ok: true,

        message:
          "Contenido del Home actualizado correctamente",

        data:
          contenido,
      });
    } catch (error) {
      next(error);
    }
  };

export const actualizarImagenHomeAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const contenido =
        await cambiarImagenHomeAdmin(
          req.file
        );

      res.status(200).json({
        ok: true,

        message:
          "Imagen principal actualizada correctamente",

        data:
          contenido,
      });
    } catch (error) {
      next(error);
    }
  };

export const eliminarImagenHomeAdministrador =
  async (
    req,
    res,
    next
  ) => {
    try {
      const contenido =
        await quitarImagenHomeAdmin();

      res.status(200).json({
        ok: true,

        message:
          "Se restauró la imagen predeterminada",

        data:
          contenido,
      });
    } catch (error) {
      next(error);
    }
  };