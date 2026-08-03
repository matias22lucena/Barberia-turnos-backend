import pool from "../config/database.js";

import {
  actualizarNombreCliente,
  bloquearBarbero,
  buscarClientePorTelefono,
  buscarTurnoSuperpuesto,
  crearCliente,
  crearTurno,
  obtenerServicioParaTurno,
  obtenerTurnoCreado,
  verificarHorarioLaboral,
  verificarRelacionBarberoServicio,
} from "../repositories/turnos.repository.js";

import { generarCodigoTurno } from "../utils/codigos.js";
import { sumarMinutosAHora } from "../utils/horas.js";

const validarId = (valor, nombreCampo) => {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(`${nombreCampo} no es válido`);
    error.statusCode = 400;
    throw error;
  }

  return id;
};

const validarFecha = (fecha) => {
  const formato = /^\d{4}-\d{2}-\d{2}$/;

  if (!formato.test(fecha)) {
    const error = new Error(
      "La fecha debe tener el formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    throw error;
  }

  const fechaObjeto = new Date(`${fecha}T12:00:00`);

  if (Number.isNaN(fechaObjeto.getTime())) {
    const error = new Error("La fecha no es válida");
    error.statusCode = 400;
    throw error;
  }

  return fechaObjeto;
};

const validarHora = (hora) => {
  const formato = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!formato.test(hora)) {
    const error = new Error(
      "La hora debe tener el formato HH:mm"
    );

    error.statusCode = 400;
    throw error;
  }

  return hora;
};

const limpiarTelefono = (telefono) => {
  return String(telefono || "").replace(/\D/g, "");
};

const convertirDiaJavaScriptADiaBaseDatos = (diaJavaScript) => {
  return diaJavaScript === 0 ? 7 : diaJavaScript;
};

export const registrarTurno = async ({
  barberoId,
  servicioId,
  fecha,
  hora,
  cliente,
}) => {
  const barberoIdValidado = validarId(barberoId, "barberoId");
  const servicioIdValidado = validarId(servicioId, "servicioId");
  const fechaObjeto = validarFecha(fecha);
  const horaInicio = validarHora(hora);

  const nombre = String(cliente?.nombre || "").trim();
  const telefono = limpiarTelefono(cliente?.telefono);
  const observacion = String(
    cliente?.observacion || ""
  ).trim();

  if (nombre.length < 3) {
    const error = new Error(
      "El nombre debe tener al menos 3 caracteres"
    );

    error.statusCode = 400;
    throw error;
  }

  if (telefono.length < 8) {
    const error = new Error(
      "El teléfono ingresado no es válido"
    );

    error.statusCode = 400;
    throw error;
  }

  if (observacion.length > 500) {
    const error = new Error(
      "La observación no puede superar los 500 caracteres"
    );

    error.statusCode = 400;
    throw error;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    /*
     * Bloqueamos la fila del barbero mientras verificamos y creamos
     * el turno. Así dos confirmaciones simultáneas para el mismo
     * barbero no pasan la validación al mismo tiempo.
     */
    const barbero = await bloquearBarbero(
      connection,
      barberoIdValidado
    );

    if (!barbero || !barbero.activo) {
      const error = new Error(
        "El profesional no existe o está inactivo"
      );

      error.statusCode = 404;
      throw error;
    }

    const servicio = await obtenerServicioParaTurno(
      connection,
      servicioIdValidado
    );

    if (!servicio || !servicio.activo) {
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

    if (!realizaServicio) {
      const error = new Error(
        "El profesional no realiza el servicio seleccionado"
      );

      error.statusCode = 400;
      throw error;
    }

    const horaFin = sumarMinutosAHora(
      horaInicio,
      servicio.duracionMinutos
    );

    const diaSemana = convertirDiaJavaScriptADiaBaseDatos(
      fechaObjeto.getDay()
    );

    const trabajaEnEseHorario =
      await verificarHorarioLaboral(connection, {
        barberoId: barberoIdValidado,
        diaSemana,
        horaInicio,
        horaFin,
      });

    if (!trabajaEnEseHorario) {
      const error = new Error(
        "El horario seleccionado está fuera de la jornada laboral"
      );

      error.statusCode = 400;
      throw error;
    }

    const turnoSuperpuesto = await buscarTurnoSuperpuesto(
      connection,
      {
        barberoId: barberoIdValidado,
        fecha,
        horaInicio,
        horaFin,
      }
    );

    if (turnoSuperpuesto) {
      const error = new Error(
        "El horario seleccionado acaba de ser reservado"
      );

      error.statusCode = 409;
      throw error;
    }

    let clienteExistente = await buscarClientePorTelefono(
      connection,
      telefono
    );

    let clienteId;

    if (clienteExistente) {
      clienteId = clienteExistente.id;

      if (clienteExistente.nombre !== nombre) {
        await actualizarNombreCliente(connection, {
          clienteId,
          nombre,
        });
      }
    } else {
      clienteId = await crearCliente(connection, {
        nombre,
        telefono,
      });
    }

    const codigo = generarCodigoTurno();

    const turnoId = await crearTurno(connection, {
      codigo,
      clienteId,
      barberoId: barberoIdValidado,
      servicioId: servicioIdValidado,
      fecha,
      horaInicio,
      horaFin,
      duracionMinutos: servicio.duracionMinutos,
      precio: servicio.precio,
      observacion,
    });

    const turnoCreado = await obtenerTurnoCreado(
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