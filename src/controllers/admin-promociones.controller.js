import {
  crearPromocionAdministrador,
  editarPromocionAdmin,
  eliminarPromocionAdministrador,
  listarPromocionesAdmin,
} from "../services/admin-promociones.service.js";

export const obtenerPromocionesAdministrador = async (
  req,
  res,
  next
) => {
  try {
    const promociones =
      await listarPromocionesAdmin();

    res.status(200).json({
      ok: true,
      data: promociones,
    });
  } catch (error) {
    next(error);
  }
};

export const crearPromocionAdministradorController = async (
  req,
  res,
  next
) => {
  try {
    const promocion =
      await crearPromocionAdministrador({
        servicioId: req.body?.servicioId,
        titulo: req.body?.titulo,
        descripcion: req.body?.descripcion,
        precio: req.body?.precio,
        duracionMinutos: req.body?.duracionMinutos,
        activo: req.body?.activo,
      });

    res.status(201).json({
      ok: true,
      message: "Promoción creada correctamente",
      data: promocion,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarPromocionAdministrador = async (
  req,
  res,
  next
) => {
  try {
    const promocion =
      await editarPromocionAdmin({
        promocionId: req.params.id,
        servicioId: req.body?.servicioId,
        titulo: req.body?.titulo,
        descripcion: req.body?.descripcion,
        precio: req.body?.precio,
        duracionMinutos: req.body?.duracionMinutos,
        activo: req.body?.activo,
      });

    res.status(200).json({
      ok: true,
      message: "Promoción actualizada correctamente",
      data: promocion,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarPromocionAdministradorController =
  async (req, res, next) => {
    try {
      await eliminarPromocionAdministrador(
        req.params.id
      );

      res.status(200).json({
        ok: true,
        message: "Promoción eliminada correctamente",
      });
    } catch (error) {
      next(error);
    }
  };