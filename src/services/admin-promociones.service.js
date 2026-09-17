import {
  actualizarPromocionAdmin,
  crearPromocionAdmin,
  eliminarPromocionAdmin,
  obtenerPromocionPorId,
  obtenerPromocionesAdmin,
} from "../repositories/promociones.repository.js";

const validarId = (
  valor
) => {
  const id =
    Number(valor);

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    const error =
      new Error(
        "El id de la promoción no es válido"
      );

    error.statusCode =
      400;

    throw error;
  }

  return id;
};

const validarServicioId = (
  valor
) => {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const id =
    Number(valor);

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    const error =
      new Error(
        "El id del servicio relacionado no es válido"
      );

    error.statusCode =
      400;

    throw error;
  }

  return id;
};

const validarTitulo = (
  titulo
) => {
  const valor =
    String(
      titulo || ""
    ).trim();

  if (
    valor.length < 2
  ) {
    const error =
      new Error(
        "El título debe tener al menos 2 caracteres"
      );

    error.statusCode =
      400;

    throw error;
  }

  if (
    valor.length >
    120
  ) {
    const error =
      new Error(
        "El título no puede superar los 120 caracteres"
      );

    error.statusCode =
      400;

    throw error;
  }

  return valor;
};

const validarDescripcion = (
  descripcion
) => {
  const valor =
    String(
      descripcion ||
        ""
    ).trim();

  if (
    valor.length >
    500
  ) {
    const error =
      new Error(
        "La descripción no puede superar los 500 caracteres"
      );

    error.statusCode =
      400;

    throw error;
  }

  return valor;
};

const validarPrecio = (
  valor
) => {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const precio =
    Number(valor);

  if (
    !Number.isFinite(
      precio
    ) ||
    precio < 0
  ) {
    const error =
      new Error(
        "El precio debe ser un número mayor o igual a cero"
      );

    error.statusCode =
      400;

    throw error;
  }

  return precio;
};

const validarDuracion = (
  valor
) => {
  const duracion =
    Number(valor);

  if (
    !Number.isInteger(
      duracion
    ) ||
    duracion <= 0
  ) {
    const error =
      new Error(
        "La duración debe ser un número entero mayor que cero"
      );

    error.statusCode =
      400;

    throw error;
  }

  return duracion;
};

const validarCantidadServicios = (
  valor
) => {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return 1;
  }

  const cantidad =
    Number(valor);

  if (
    !Number.isInteger(
      cantidad
    ) ||
    cantidad <= 0
  ) {
    const error =
      new Error(
        "La cantidad de turnos debe ser un número entero mayor que cero"
      );

    error.statusCode =
      400;

    throw error;
  }

  if (
    cantidad > 50
  ) {
    const error =
      new Error(
        "La cantidad de turnos no puede superar 50"
      );

    error.statusCode =
      400;

    throw error;
  }

  return cantidad;
};

const validarActivo = (
  valor
) => {
  if (
    typeof valor !==
    "boolean"
  ) {
    const error =
      new Error(
        "El campo activo debe ser true o false"
      );

    error.statusCode =
      400;

    throw error;
  }

  return valor;
};

export const listarPromocionesAdmin =
  async () => {
    return await obtenerPromocionesAdmin();
  };

export const crearPromocionAdministrador =
  async ({
    servicioId,
    titulo,
    descripcion,
    precio,
    duracionMinutos,
    cantidadServicios,
    activo,
  }) => {
    const datos = {
      servicioId:
        validarServicioId(
          servicioId
        ),

      titulo:
        validarTitulo(
          titulo
        ),

      descripcion:
        validarDescripcion(
          descripcion
        ),

      precio:
        validarPrecio(
          precio
        ),

      duracionMinutos:
        validarDuracion(
          duracionMinutos
        ),

      cantidadServicios:
        validarCantidadServicios(
          cantidadServicios
        ),

      activo:
        validarActivo(
          activo
        ),
    };

    const promocionId =
      await crearPromocionAdmin(
        datos
      );

    return await obtenerPromocionPorId(
      promocionId
    );
  };

export const editarPromocionAdmin =
  async ({
    promocionId,
    servicioId,
    titulo,
    descripcion,
    precio,
    duracionMinutos,
    cantidadServicios,
    activo,
  }) => {
    const idValidado =
      validarId(
        promocionId
      );

    const promocionExistente =
      await obtenerPromocionPorId(
        idValidado
      );

    if (
      !promocionExistente
    ) {
      const error =
        new Error(
          "La promoción no existe"
        );

      error.statusCode =
        404;

      throw error;
    }

    const datos = {
      promocionId:
        idValidado,

      servicioId:
        validarServicioId(
          servicioId
        ),

      titulo:
        validarTitulo(
          titulo
        ),

      descripcion:
        validarDescripcion(
          descripcion
        ),

      precio:
        validarPrecio(
          precio
        ),

      duracionMinutos:
        validarDuracion(
          duracionMinutos
        ),

      cantidadServicios:
        validarCantidadServicios(
          cantidadServicios
        ),

      activo:
        validarActivo(
          activo
        ),
    };

    await actualizarPromocionAdmin(
      datos
    );

    return await obtenerPromocionPorId(
      idValidado
    );
  };

export const eliminarPromocionAdministrador =
  async (
    promocionId
  ) => {
    const idValidado =
      validarId(
        promocionId
      );

    const promocionExistente =
      await obtenerPromocionPorId(
        idValidado
      );

    if (
      !promocionExistente
    ) {
      const error =
        new Error(
          "La promoción no existe"
        );

      error.statusCode =
        404;

      throw error;
    }

    await eliminarPromocionAdmin(
      idValidado
    );
  };