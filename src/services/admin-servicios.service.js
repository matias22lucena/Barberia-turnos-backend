import {
  actualizarServicioAdmin,
  obtenerServicioPorId,
  obtenerServiciosAdmin,
} from "../repositories/servicios.repository.js";

const validarId = (valor) => {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("El id del servicio no es válido");
    error.statusCode = 400;
    throw error;
  }

  return id;
};

const validarNombre = (nombre) => {
  const valor = String(nombre || "").trim();

  if (valor.length < 2) {
    const error = new Error(
      "El nombre debe tener al menos 2 caracteres"
    );
    error.statusCode = 400;
    throw error;
  }

  if (valor.length > 100) {
    const error = new Error(
      "El nombre no puede superar los 100 caracteres"
    );
    error.statusCode = 400;
    throw error;
  }

  return valor;
};

const validarDescripcion = (descripcion) => {
  const valor = String(descripcion || "").trim();

  if (valor.length > 255) {
    const error = new Error(
      "La descripción no puede superar los 255 caracteres"
    );
    error.statusCode = 400;
    throw error;
  }

  return valor;
};

const validarDuracion = (valor) => {
  const duracion = Number(valor);

  if (!Number.isInteger(duracion) || duracion <= 0) {
    const error = new Error(
      "La duración debe ser un número entero mayor que cero"
    );
    error.statusCode = 400;
    throw error;
  }

  return duracion;
};

const validarPrecio = (valor) => {
  const precio = Number(valor);

  if (!Number.isFinite(precio) || precio < 0) {
    const error = new Error(
      "El precio debe ser un número mayor o igual a cero"
    );
    error.statusCode = 400;
    throw error;
  }

  return precio;
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

export const listarServiciosAdmin = async () => {
  return await obtenerServiciosAdmin();
};

export const editarServicioAdmin = async ({
  servicioId,
  nombre,
  descripcion,
  duracionMinutos,
  precio,
  activo,
}) => {
  const idValidado = validarId(servicioId);

  const servicioExistente = await obtenerServicioPorId(idValidado);

  if (!servicioExistente) {
    const error = new Error("El servicio no existe");
    error.statusCode = 404;
    throw error;
  }

  const datos = {
    servicioId: idValidado,
    nombre: validarNombre(nombre),
    descripcion: validarDescripcion(descripcion),
    duracionMinutos: validarDuracion(duracionMinutos),
    precio: validarPrecio(precio),
    activo: validarActivo(activo),
  };

  await actualizarServicioAdmin(datos);

  return await obtenerServicioPorId(idValidado);
};