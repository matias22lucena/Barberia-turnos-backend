import {
  crearHorarioAdministrador,
  editarHorarioAdministrador,
  eliminarHorarioAdministrador,
  listarHorariosAdmin,
} from "../services/admin-horarios.service.js";

export const obtenerHorariosAdministrador = async (
  req,
  res,
  next
) => {
  try {
    const horarios = await listarHorariosAdmin({
      barberoId: req.query.barberoId || 1,
    });

    res.status(200).json({
      ok: true,
      data: horarios,
    });
  } catch (error) {
    next(error);
  }
};

export const crearHorarioAdministradorController = async (
  req,
  res,
  next
) => {
  try {
    const horario =
      await crearHorarioAdministrador({
        barberoId:
          req.body?.barberoId || 1,
        diaSemana: req.body?.diaSemana,
        horaInicio: req.body?.horaInicio,
        horaFin: req.body?.horaFin,
      });

    res.status(201).json({
      ok: true,
      message:
        "Horario creado correctamente",
      data: horario,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarHorarioAdministrador = async (
  req,
  res,
  next
) => {
  try {
    const horario =
      await editarHorarioAdministrador({
        horarioId: req.params.id,
        diaSemana: req.body?.diaSemana,
        horaInicio: req.body?.horaInicio,
        horaFin: req.body?.horaFin,
        activo: req.body?.activo,
      });

    res.status(200).json({
      ok: true,
      message:
        "Horario actualizado correctamente",
      data: horario,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarHorarioAdministradorController = async (
  req,
  res,
  next
) => {
  try {
    const resultado =
      await eliminarHorarioAdministrador({
        horarioId: req.params.id,
      });

    res.status(200).json({
      ok: true,
      message:
        "Horario eliminado correctamente",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};