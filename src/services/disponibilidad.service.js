import {
  obtenerBarberoPorId,
  obtenerFranjasLaborales,
  obtenerPromocionPorId,
  obtenerServicioPorId,
  obtenerTurnosOcupadosPorFecha,
  verificarBarberoRealizaServicio,
} from "../repositories/disponibilidad.repository.js";

import {
  convertirHoraAMinutos,
  generarHorariosDeFranja,
  sumarMinutosAHora,
} from "../utils/horas.js";

import {
  obtenerFechaHoraActualArgentina,
} from "../utils/fechaHora.js";

const validarId = (
  valor,
  nombreCampo
) => {
  const id = Number(valor);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    const error = new Error(
      `El parámetro ${nombreCampo} debe ser un número entero válido`
    );

    error.statusCode = 400;

    throw error;
  }

  return id;
};

const validarFecha = (fecha) => {
  const formatoFecha =
    /^\d{4}-\d{2}-\d{2}$/;

  if (
    !formatoFecha.test(fecha)
  ) {
    const error = new Error(
      "La fecha debe tener el formato YYYY-MM-DD"
    );

    error.statusCode = 400;

    throw error;
  }

  const fechaObjeto =
    new Date(
      `${fecha}T12:00:00`
    );

  if (
    Number.isNaN(
      fechaObjeto.getTime()
    )
  ) {
    const error = new Error(
      "La fecha ingresada no es válida"
    );

    error.statusCode = 400;

    throw error;
  }

  return fechaObjeto;
};

const convertirDiaJavaScriptADiaBaseDatos = (
  diaJavaScript
) => {
  return diaJavaScript === 0
    ? 7
    : diaJavaScript;
};

const horarioSeSuperpone = ({
  nuevaHoraInicio,
  nuevaHoraFin,
  turnoExistente,
}) => {
  const nuevoInicioMinutos =
    convertirHoraAMinutos(
      nuevaHoraInicio
    );

  const nuevoFinMinutos =
    convertirHoraAMinutos(
      nuevaHoraFin
    );

  const turnoInicioMinutos =
    convertirHoraAMinutos(
      turnoExistente.horaInicio
    );

  const turnoFinMinutos =
    convertirHoraAMinutos(
      turnoExistente.horaFin
    );

  return (
    nuevoInicioMinutos <
      turnoFinMinutos &&
    nuevoFinMinutos >
      turnoInicioMinutos
  );
};

export const obtenerDisponibilidad = async ({
  barberoId,
  servicioId,
  promocionId = null,
  fecha,
}) => {
  const barberoIdValidado =
    validarId(
      barberoId,
      "barberoId"
    );

  const servicioIdValidado =
    validarId(
      servicioId,
      "servicioId"
    );

  const promocionIdValidado =
    promocionId !== null &&
    promocionId !== undefined &&
    promocionId !== ""
      ? validarId(
          promocionId,
          "promocionId"
        )
      : null;

  const fechaObjeto =
    validarFecha(fecha);

  const servicio =
    await obtenerServicioPorId(
      servicioIdValidado
    );

  if (
    !servicio ||
    !servicio.activo
  ) {
    const error = new Error(
      "El servicio solicitado no existe o está inactivo"
    );

    error.statusCode = 404;

    throw error;
  }

  let promocion = null;

  if (promocionIdValidado) {
    promocion =
      await obtenerPromocionPorId(
        promocionIdValidado
      );

    if (
      !promocion ||
      !promocion.activo
    ) {
      const error = new Error(
        "La promoción solicitada no existe o está inactiva"
      );

      error.statusCode = 404;

      throw error;
    }

    if (
      !promocion.servicioId ||
      Number(
        promocion.servicioId
      ) !==
        servicioIdValidado
    ) {
      const error = new Error(
        "La promoción no corresponde al servicio seleccionado"
      );

      error.statusCode = 400;

      throw error;
    }
  }

  const barbero =
    await obtenerBarberoPorId(
      barberoIdValidado
    );

  if (
    !barbero ||
    !barbero.activo
  ) {
    const error = new Error(
      "El barbero solicitado no existe o está inactivo"
    );

    error.statusCode = 404;

    throw error;
  }

  const realizaServicio =
    await verificarBarberoRealizaServicio(
      barberoIdValidado,
      servicioIdValidado
    );

  if (!realizaServicio) {
    const error = new Error(
      "El barbero seleccionado no realiza este servicio"
    );

    error.statusCode = 400;

    throw error;
  }

  /*
   * La duración efectiva depende
   * de si se está reservando
   * servicio o promoción.
   */
  const duracionReserva =
    promocion
      ? Number(
          promocion.duracionMinutos
        )
      : Number(
          servicio.duracionMinutos
        );

  const diaSemana =
    convertirDiaJavaScriptADiaBaseDatos(
      fechaObjeto.getDay()
    );

  const franjas =
    await obtenerFranjasLaborales(
      barberoIdValidado,
      diaSemana
    );

  const turnosOcupados =
    await obtenerTurnosOcupadosPorFecha(
      barberoIdValidado,
      fecha
    );

  const horariosGenerados =
    franjas.flatMap(
      (franja) =>
        generarHorariosDeFranja({
          horaInicio:
            franja.horaInicio,

          horaFin:
            franja.horaFin,

          duracionServicio:
            duracionReserva,

          intervaloMinutos: 30,
        })
    );

  const horariosSinSuperposiciones =
    horariosGenerados.filter(
      (horaInicio) => {
        const horaFin =
          sumarMinutosAHora(
            horaInicio,
            duracionReserva
          );

        const tieneSuperposicion =
          turnosOcupados.some(
            (
              turnoExistente
            ) =>
              horarioSeSuperpone({
                nuevaHoraInicio:
                  horaInicio,

                nuevaHoraFin:
                  horaFin,

                turnoExistente,
              })
          );

        return !tieneSuperposicion;
      }
    );

  const fechaHoraActual =
    obtenerFechaHoraActualArgentina();

  let horariosDisponibles =
    horariosSinSuperposiciones;

  /*
   * Fecha anterior.
   */
  if (
    fecha <
    fechaHoraActual.fecha
  ) {
    horariosDisponibles = [];
  }

  /*
   * Hoy: quitamos horarios
   * que ya comenzaron.
   */
  if (
    fecha ===
    fechaHoraActual.fecha
  ) {
    horariosDisponibles =
      horariosSinSuperposiciones.filter(
        (horaInicio) =>
          convertirHoraAMinutos(
            horaInicio
          ) >
          fechaHoraActual.minutosActuales
      );
  }

  return {
    fecha,

    barbero: {
      id: barbero.id,
      nombre: barbero.nombre,
      apellido:
        barbero.apellido,
    },

    servicio: {
      id: servicio.id,
      nombre: servicio.nombre,
      duracionMinutos:
        servicio.duracionMinutos,
    },

    promocion: promocion
      ? {
          id: promocion.id,
          titulo:
            promocion.titulo,
          duracionMinutos:
            promocion.duracionMinutos,
          precio:
            promocion.precio,
        }
      : null,

    duracionReserva,

    horarios:
      horariosDisponibles,
  };
};