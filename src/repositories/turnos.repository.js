export const bloquearBarbero = async (connection, barberoId) => {
  const [rows] = await connection.execute(
    `
      SELECT
        id,
        nombre,
        activo
      FROM barberos
      WHERE id = ?
      FOR UPDATE
    `,
    [barberoId]
  );

  return rows[0] || null;
};

export const obtenerServicioParaTurno = async (
  connection,
  servicioId
) => {
  const [rows] = await connection.execute(
    `
      SELECT
        id,
        nombre,
        duracion_minutos AS duracionMinutos,
        precio,
        activo
      FROM servicios
      WHERE id = ?
      LIMIT 1
    `,
    [servicioId]
  );

  return rows[0] || null;
};

export const verificarRelacionBarberoServicio = async (
  connection,
  barberoId,
  servicioId
) => {
  const [rows] = await connection.execute(
    `
      SELECT
        barbero_id
      FROM barbero_servicios
      WHERE barbero_id = ?
        AND servicio_id = ?
      LIMIT 1
    `,
    [barberoId, servicioId]
  );

  return rows.length > 0;
};

export const verificarHorarioLaboral = async (
  connection,
  {
    barberoId,
    diaSemana,
    horaInicio,
    horaFin,
  }
) => {
  const [rows] = await connection.execute(
    `
      SELECT
        id
      FROM horarios_barberos
      WHERE barbero_id = ?
        AND dia_semana = ?
        AND activo = 1
        AND hora_inicio <= ?
        AND hora_fin >= ?
      LIMIT 1
    `,
    [barberoId, diaSemana, horaInicio, horaFin]
  );

  return rows.length > 0;
};

export const buscarTurnoSuperpuesto = async (
  connection,
  {
    barberoId,
    fecha,
    horaInicio,
    horaFin,
  }
) => {
  const [rows] = await connection.execute(
    `
      SELECT
        id,
        hora_inicio AS horaInicio,
        hora_fin AS horaFin
      FROM turnos
      WHERE barbero_id = ?
        AND fecha = ?
        AND estado = 'CONFIRMADO'
        AND hora_inicio < ?
        AND hora_fin > ?
      LIMIT 1
    `,
    [barberoId, fecha, horaFin, horaInicio]
  );

  return rows[0] || null;
};

export const buscarClientePorTelefono = async (
  connection,
  telefono
) => {
  const [rows] = await connection.execute(
    `
      SELECT
        id,
        nombre,
        telefono
      FROM clientes
      WHERE telefono = ?
      LIMIT 1
    `,
    [telefono]
  );

  return rows[0] || null;
};

export const crearCliente = async (
  connection,
  {
    nombre,
    telefono,
  }
) => {
  const [result] = await connection.execute(
    `
      INSERT INTO clientes (
        nombre,
        telefono
      )
      VALUES (?, ?)
    `,
    [nombre, telefono]
  );

  return result.insertId;
};

export const actualizarNombreCliente = async (
  connection,
  {
    clienteId,
    nombre,
  }
) => {
  await connection.execute(
    `
      UPDATE clientes
      SET nombre = ?
      WHERE id = ?
    `,
    [nombre, clienteId]
  );
};

export const crearTurno = async (
  connection,
  {
    codigo,
    clienteId,
    barberoId,
    servicioId,
    fecha,
    horaInicio,
    horaFin,
    duracionMinutos,
    precio,
    observacion,
  }
) => {
  const [result] = await connection.execute(
    `
      INSERT INTO turnos (
        codigo,
        cliente_id,
        barbero_id,
        servicio_id,
        fecha,
        hora_inicio,
        hora_fin,
        duracion_minutos,
        precio,
        observacion,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMADO')
    `,
    [
      codigo,
      clienteId,
      barberoId,
      servicioId,
      fecha,
      horaInicio,
      horaFin,
      duracionMinutos,
      precio,
      observacion || null,
    ]
  );

  return result.insertId;
};

export const obtenerTurnoCreado = async (
  connection,
  turnoId
) => {
  const [rows] = await connection.execute(
    `
      SELECT
        t.id,
        t.codigo,
        t.fecha,
        TIME_FORMAT(t.hora_inicio, '%H:%i') AS horaInicio,
        TIME_FORMAT(t.hora_fin, '%H:%i') AS horaFin,
        t.duracion_minutos AS duracionMinutos,
        t.precio,
        t.observacion,
        t.estado,

        c.id AS clienteId,
        c.nombre AS clienteNombre,
        c.telefono AS clienteTelefono,

        b.id AS barberoId,
        b.nombre AS barberoNombre,

        s.id AS servicioId,
        s.nombre AS servicioNombre

      FROM turnos t

      INNER JOIN clientes c
        ON c.id = t.cliente_id

      INNER JOIN barberos b
        ON b.id = t.barbero_id

      INNER JOIN servicios s
        ON s.id = t.servicio_id

      WHERE t.id = ?
      LIMIT 1
    `,
    [turnoId]
  );

  return rows[0] || null;
};