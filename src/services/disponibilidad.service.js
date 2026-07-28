import {
  obtenerBarberoPorId,
  obtenerFranjasLaborales,
  obtenerServicioPorId,
  verificarBarberoRealizaServicio,
} from "../repositories/disponibilidad.repository.js";

import { generarHorariosDeFranja } from "../utils/horas.js";

const validarId = (valor, nombreCampo) => {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(
      `El parámetro ${nombreCampo} debe ser un número entero válido`
    );

    error.statusCode = 400;
    throw error;
  }

  return id;
};

const validarFecha = (fecha) => {
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

  if (!formatoFecha.test(fecha)) {
    const error = new Error(
      "La fecha debe tener el formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    throw error;
  }

  const fechaObjeto = new Date(`${fecha}T12:00:00`);

  if (Number.isNaN(fechaObjeto.getTime())) {
    const error = new Error("La fecha ingresada no es válida");

    error.statusCode = 400;
    throw error;
  }

  return fechaObjeto;
};

const convertirDiaJavaScriptADiaBaseDatos = (diaJavaScript) => {
  return diaJavaScript === 0 ? 7 : diaJavaScript;
};

export const obtenerDisponibilidad = async ({
  barberoId,
  servicioId,
  fecha,
}) => {
  const barberoIdValidado = validarId(barberoId, "barberoId");
  const servicioIdValidado = validarId(servicioId, "servicioId");
  const fechaObjeto = validarFecha(fecha);

  const servicio = await obtenerServicioPorId(servicioIdValidado);

  if (!servicio || !servicio.activo) {
    const error = new Error(
      "El servicio solicitado no existe o está inactivo"
    );

    error.statusCode = 404;
    throw error;
  }

  const barbero = await obtenerBarberoPorId(barberoIdValidado);

  if (!barbero || !barbero.activo) {
    const error = new Error(
      "El barbero solicitado no existe o está inactivo"
    );

    error.statusCode = 404;
    throw error;
  }

  const realizaServicio = await verificarBarberoRealizaServicio(
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

  const diaSemana = convertirDiaJavaScriptADiaBaseDatos(
    fechaObjeto.getDay()
  );

  const franjas = await obtenerFranjasLaborales(
    barberoIdValidado,
    diaSemana
  );

  const horariosDisponibles = franjas.flatMap((franja) =>
    generarHorariosDeFranja({
      horaInicio: franja.horaInicio,
      horaFin: franja.horaFin,
      duracionServicio: servicio.duracionMinutos,
      intervaloMinutos: 30,
    })
  );

  return {
    fecha,
    barbero: {
      id: barbero.id,
      nombre: barbero.nombre,
    },
    servicio: {
      id: servicio.id,
      nombre: servicio.nombre,
      duracionMinutos: servicio.duracionMinutos,
    },
    horarios: horariosDisponibles,
  };
};