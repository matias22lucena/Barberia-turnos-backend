import pool from "../config/database.js";

import {
  actualizarNombreCliente,
  bloquearBarbero,
  buscarClientePorTelefono,
  buscarTurnoSuperpuesto,
  crearCliente,
  crearTurno,
  obtenerPromocionParaTurno,
  obtenerServicioParaTurno,
  obtenerTurnoCreado,
  verificarHorarioLaboral,
  verificarRelacionBarberoServicio,
} from "../repositories/turnos.repository.js";

import {
  generarCodigoTurno,
} from "../utils/codigos.js";

import {
  convertirHoraAMinutos,
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
      `${nombreCampo} no es válido`
    );

    error.statusCode = 400;

    throw error;
  }

  return id;
};

const validarFecha = (
  fecha
) => {
  const formato =
    /^\d{4}-\d{2}-\d{2}$/;

  if (
    !formato.test(fecha)
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
      "La fecha no es válida"
    );

    error.statusCode = 400;

    throw error;
  }

  return fechaObjeto;
};

const validarHora = (
  hora
) => {
  const formato =
    /^([01]\d|2[0-3]):[0-5]\d$/;

  if (
    !formato.test(hora)
  ) {
    const error = new Error(
      "La hora debe tener el formato HH:mm"
    );

    error.statusCode = 400;

    throw error;
  }

  return hora;
};

const validarCliente = (
  cliente
) => {
  const nombre =
    String(
      cliente?.nombre || ""
    ).trim();

  const telefono =
    String(
      cliente?.telefono || ""
    ).replace(
      /\D/g,
      ""
    );

  if (
    nombre.length < 3
  ) {
    const error = new Error(
      "El nombre del cliente no es válido"
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    telefono.length < 8 ||
    telefono.length > 15
  ) {
    const error = new Error(
      "El número de celular no es válido"
    );

    error.statusCode = 400;

    throw error;
  }

  return {
    nombre,
    telefono,
  };
};

const convertirDiaJavaScriptADiaBaseDatos = (
  diaJavaScript
) => {
  return diaJavaScript === 0
    ? 7
    : diaJavaScript;
};

const validarQueNoSeaPasado = (
  fecha,
  hora
) => {
  const fechaHoraActual =
    obtenerFechaHoraActualArgentina();

  if (
    fecha <
    fechaHoraActual.fecha
  ) {
    const error = new Error(
      "No se puede reservar un turno en una fecha pasada"
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    fecha ===
      fechaHoraActual.fecha &&
    convertirHoraAMinutos(
      hora
    ) <=
      fechaHoraActual.minutosActuales
  ) {
    const error = new Error(
      "Uno de los horarios seleccionados ya pasó"
    );

    error.statusCode = 400;

    throw error;
  }
};

const obtenerOCrearCliente = async (
  connection,
  cliente
) => {
  const clienteValidado =
    validarCliente(cliente);

  const existente =
    await buscarClientePorTelefono(
      connection,
      clienteValidado.telefono
    );

  if (existente) {
    if (
      existente.nombre !==
      clienteValidado.nombre
    ) {
      await actualizarNombreCliente(
        connection,
        {
          clienteId:
            existente.id,

          nombre:
            clienteValidado.nombre,
        }
      );
    }

    return existente.id;
  }

  return await crearCliente(
    connection,
    clienteValidado
  );
};

const validarDatosBase = async (
  connection,
  {
    barberoIdValidado,
    servicioIdValidado,
    promocionIdValidado,
  }
) => {
  const barbero =
    await bloquearBarbero(
      connection,
      barberoIdValidado
    );

  if (
    !barbero ||
    !barbero.activo
  ) {
    const error = new Error(
      "El profesional no existe o está inactivo"
    );

    error.statusCode = 404;

    throw error;
  }

  const servicio =
    await obtenerServicioParaTurno(
      connection,
      servicioIdValidado
    );

  if (
    !servicio ||
    !servicio.activo
  ) {
    const error = new Error(
      "El servicio no existe o está inactivo"
    );

    error.statusCode = 404;

    throw error;
  }

  const realizaServicio =
    await verificarRelacionBarberoServicio(
      connection,
      barberoIdValidado,
      servicioIdValidado
    );

  if (
    !realizaServicio
  ) {
    const error = new Error(
      "El profesional no realiza el servicio seleccionado"
    );

    error.statusCode = 400;

    throw error;
  }

  let promocion = null;

  if (
    promocionIdValidado
  ) {
    promocion =
      await obtenerPromocionParaTurno(
        connection,
        promocionIdValidado
      );

    if (
      !promocion ||
      !promocion.activo
    ) {
      const error = new Error(
        "La promoción no existe o está inactiva"
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

  return {
    barbero,
    servicio,
    promocion,
  };
};

const validarHorario = async (
  connection,
  {
    barberoId,
    fecha,
    hora,
    duracionMinutos,
  }
) => {
  const fechaObjeto =
    validarFecha(fecha);

  const horaInicio =
    validarHora(hora);

  validarQueNoSeaPasado(
    fecha,
    horaInicio
  );

  const horaFin =
    sumarMinutosAHora(
      horaInicio,
      duracionMinutos
    );

  const diaSemana =
    convertirDiaJavaScriptADiaBaseDatos(
      fechaObjeto.getDay()
    );

  const trabaja =
    await verificarHorarioLaboral(
      connection,
      {
        barberoId,
        diaSemana,
        horaInicio,
        horaFin,
      }
    );

  if (
    !trabaja
  ) {
    const error = new Error(
      `El horario ${fecha} ${horaInicio} está fuera de la jornada laboral`
    );

    error.statusCode = 400;

    throw error;
  }

  const superpuesto =
    await buscarTurnoSuperpuesto(
      connection,
      {
        barberoId,
        fecha,
        horaInicio,
        horaFin,
      }
    );

  if (
    superpuesto
  ) {
    const error = new Error(
      `El horario ${fecha} ${horaInicio} acaba de ser reservado`
    );

    error.statusCode = 409;

    throw error;
  }

  return {
    fecha,
    horaInicio,
    horaFin,
  };
};

export const registrarTurno = async ({
  barberoId,
  servicioId,
  promocionId = null,
  fecha = null,
  hora = null,
  turnos = null,
  cliente,
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
    promocionId
      ? validarId(
          promocionId,
          "promocionId"
        )
      : null;

  const connection =
    await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      servicio,
      promocion,
    } =
      await validarDatosBase(
        connection,
        {
          barberoIdValidado,
          servicioIdValidado,
          promocionIdValidado,
        }
      );

    const clienteId =
      await obtenerOCrearCliente(
        connection,
        cliente
      );

    const cantidadPromocion =
      promocion
        ? Number(
            promocion.cantidadServicios ||
              1
          )
        : 1;

    const esPaquete =
      Boolean(
        promocion &&
          cantidadPromocion > 1
      );

    /*
     * ==========================
     * PROMOCIÓN PAQUETE
     * ==========================
     */
    if (esPaquete) {
      if (
        !Array.isArray(turnos)
      ) {
        const error = new Error(
          `Esta promoción requiere seleccionar ${cantidadPromocion} turnos`
        );

        error.statusCode = 400;

        throw error;
      }

      if (
        turnos.length !==
        cantidadPromocion
      ) {
        const error = new Error(
          `Debés seleccionar exactamente ${cantidadPromocion} turnos`
        );

        error.statusCode = 400;

        throw error;
      }

      const fechasElegidas =
        turnos.map(
          (turno) =>
            turno.fecha
        );

      const fechasUnicas =
        new Set(
          fechasElegidas
        );

      if (
        fechasUnicas.size !==
        turnos.length
      ) {
        const error = new Error(
          "Cada corte de la promoción debe tener un día diferente"
        );

        error.statusCode = 400;

        throw error;
      }

      const duracion =
        Number(
          promocion.duracionMinutos
        );

      const horariosValidados =
        [];

      /*
       * Primero comprobamos TODOS.
       * Todavía no guardamos ninguno.
       */
      for (
        const turnoSeleccionado
        of turnos
      ) {
        const validado =
          await validarHorario(
            connection,
            {
              barberoId:
                barberoIdValidado,

              fecha:
                turnoSeleccionado.fecha,

              hora:
                turnoSeleccionado.hora,

              duracionMinutos:
                duracion,
            }
          );

        horariosValidados.push(
          validado
        );
      }

      const codigoGrupo =
        generarCodigoTurno();

      const precioTotal =
        Number(
          promocion.precio || 0
        );

      const precioPorTurno =
        Number(
          (
            precioTotal /
            cantidadPromocion
          ).toFixed(2)
        );

      const turnosCreados =
        [];

      for (
        let indice = 0;
        indice <
        horariosValidados.length;
        indice += 1
      ) {
        const horario =
          horariosValidados[
            indice
          ];

        const turnoId =
          await crearTurno(
            connection,
            {
              codigo:
                generarCodigoTurno(),

              clienteId,

              barberoId:
                barberoIdValidado,

              servicioId:
                servicioIdValidado,

              promocionId:
                promocionIdValidado,

              codigoGrupoPromocion:
                codigoGrupo,

              numeroTurnoPromocion:
                indice + 1,

              cantidadTurnosPromocion:
                cantidadPromocion,

              precioTotalPromocion:
                precioTotal,

              fecha:
                horario.fecha,

              horaInicio:
                horario.horaInicio,

              horaFin:
                horario.horaFin,

              duracionMinutos:
                duracion,

              precio:
                precioPorTurno,

              observacion:
                null,
            }
          );

        const creado =
          await obtenerTurnoCreado(
            connection,
            turnoId
          );

        turnosCreados.push(
          creado
        );
      }

      await connection.commit();

      return {
        esPaquete: true,

        codigoReserva:
          codigoGrupo,

        promocionId:
          promocion.id,

        promocionTitulo:
          promocion.titulo,

        cantidadTurnos:
          cantidadPromocion,

        precioTotal,

        clienteNombre:
          cliente.nombre,

        clienteTelefono:
          cliente.telefono,

        servicioNombre:
          servicio.nombre,

        barberoNombre:
          turnosCreados[0]
            ?.barberoNombre,

        turnos:
          turnosCreados,
      };
    }

    /*
     * ==========================
     * TURNO NORMAL
     * ==========================
     */

    if (
      !fecha ||
      !hora
    ) {
      const error = new Error(
        "La fecha y la hora son obligatorias"
      );

      error.statusCode = 400;

      throw error;
    }

    const duracion =
      promocion
        ? Number(
            promocion.duracionMinutos
          )
        : Number(
            servicio.duracionMinutos
          );

    const precio =
      promocion
        ? promocion.precio
        : servicio.precio;

    const horario =
      await validarHorario(
        connection,
        {
          barberoId:
            barberoIdValidado,

          fecha,
          hora,

          duracionMinutos:
            duracion,
        }
      );

    const turnoId =
      await crearTurno(
        connection,
        {
          codigo:
            generarCodigoTurno(),

          clienteId,

          barberoId:
            barberoIdValidado,

          servicioId:
            servicioIdValidado,

          promocionId:
            promocionIdValidado,

          fecha:
            horario.fecha,

          horaInicio:
            horario.horaInicio,

          horaFin:
            horario.horaFin,

          duracionMinutos:
            duracion,

          precio,

          observacion:
            null,
        }
      );

    const turnoCreado =
      await obtenerTurnoCreado(
        connection,
        turnoId
      );

    await connection.commit();

    return turnoCreado;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};