import {
  actualizarHorarioAdmin,
  buscarHorarioSuperpuesto,
  crearHorarioAdmin,
  eliminarHorarioAdmin,
  obtenerHorarioPorId,
  obtenerHorariosAdminPorBarbero,
} from "../repositories/horarios.repository.js";

const validarId = (valor, nombreCampo) => {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(
      `${nombreCampo} no es válido`
    );

    error.statusCode = 400;
    throw error;
  }

  return id;
};

const validarDiaSemana = (valor) => {
  const dia = Number(valor);

  if (
    !Number.isInteger(dia) ||
    dia < 1 ||
    dia > 7
  ) {
    const error = new Error(
      "El día de la semana debe estar entre 1 y 7"
    );

    error.statusCode = 400;
    throw error;
  }

  return dia;
};

const validarHora = (hora, nombreCampo) => {
  const valor = String(hora || "").trim();

  const formato = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!formato.test(valor)) {
    const error = new Error(
      `${nombreCampo} debe tener formato HH:mm`
    );

    error.statusCode = 400;
    throw error;
  }

  return valor;
};

const convertirHoraAMinutos = (hora) => {
  const [horas, minutos] = hora
    .split(":")
    .map(Number);

  return horas * 60 + minutos;
};

const validarRangoHorario = (
  horaInicio,
  horaFin
) => {
  if (
    convertirHoraAMinutos(horaFin) <=
    convertirHoraAMinutos(horaInicio)
  ) {
    const error = new Error(
      "La hora de fin debe ser posterior a la hora de inicio"
    );

    error.statusCode = 400;
    throw error;
  }
};

const validarActivo = (valor) => {
  if (typeof valor !== "boolean") {
    const error = new Error(
      "El campo activo debe ser true o false"
    );

    error.statusCode = 400;
    throw error;
  }

  return valor;
};

export const listarHorariosAdmin = async ({
  barberoId,
}) => {
  const idValidado = validarId(
    barberoId,
    "barberoId"
  );

  return await obtenerHorariosAdminPorBarbero(
    idValidado
  );
};

export const crearHorarioAdministrador = async ({
  barberoId,
  diaSemana,
  horaInicio,
  horaFin,
}) => {
  const barberoIdValidado = validarId(
    barberoId,
    "barberoId"
  );

  const diaValidado =
    validarDiaSemana(diaSemana);

  const inicioValidado = validarHora(
    horaInicio,
    "horaInicio"
  );

  const finValidado = validarHora(
    horaFin,
    "horaFin"
  );

  validarRangoHorario(
    inicioValidado,
    finValidado
  );

  const horarioSuperpuesto =
    await buscarHorarioSuperpuesto({
      barberoId: barberoIdValidado,
      diaSemana: diaValidado,
      horaInicio: inicioValidado,
      horaFin: finValidado,
    });

  if (horarioSuperpuesto) {
    const error = new Error(
      "La franja horaria se superpone con otra existente"
    );

    error.statusCode = 409;
    throw error;
  }

  const horarioId = await crearHorarioAdmin({
    barberoId: barberoIdValidado,
    diaSemana: diaValidado,
    horaInicio: inicioValidado,
    horaFin: finValidado,
  });

  return await obtenerHorarioPorId(horarioId);
};

export const editarHorarioAdministrador = async ({
  horarioId,
  diaSemana,
  horaInicio,
  horaFin,
  activo,
}) => {
  const horarioIdValidado = validarId(
    horarioId,
    "horarioId"
  );

  const existente = await obtenerHorarioPorId(
    horarioIdValidado
  );

  if (!existente) {
    const error = new Error(
      "El horario no existe"
    );

    error.statusCode = 404;
    throw error;
  }

  const diaValidado =
    validarDiaSemana(diaSemana);

  const inicioValidado = validarHora(
    horaInicio,
    "horaInicio"
  );

  const finValidado = validarHora(
    horaFin,
    "horaFin"
  );

  const activoValidado =
    validarActivo(activo);

  validarRangoHorario(
    inicioValidado,
    finValidado
  );

  if (activoValidado) {
    const horarioSuperpuesto =
      await buscarHorarioSuperpuesto({
        barberoId: existente.barberoId,
        diaSemana: diaValidado,
        horaInicio: inicioValidado,
        horaFin: finValidado,
        excluirHorarioId: horarioIdValidado,
      });

    if (horarioSuperpuesto) {
      const error = new Error(
        "La franja horaria se superpone con otra existente"
      );

      error.statusCode = 409;
      throw error;
    }
  }

  await actualizarHorarioAdmin({
    horarioId: horarioIdValidado,
    diaSemana: diaValidado,
    horaInicio: inicioValidado,
    horaFin: finValidado,
    activo: activoValidado,
  });

  return await obtenerHorarioPorId(
    horarioIdValidado
  );
};

export const eliminarHorarioAdministrador = async ({
  horarioId,
}) => {
  const horarioIdValidado = validarId(
    horarioId,
    "horarioId"
  );

  const existente = await obtenerHorarioPorId(
    horarioIdValidado
  );

  if (!existente) {
    const error = new Error(
      "El horario no existe"
    );

    error.statusCode = 404;
    throw error;
  }

  await eliminarHorarioAdmin(
    horarioIdValidado
  );

  return {
    id: horarioIdValidado,
  };
};