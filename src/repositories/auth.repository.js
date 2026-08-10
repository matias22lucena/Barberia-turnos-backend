export const buscarAdministradorPorEmail = async (
  connection,
  email
) => {
  const [filas] = await connection.execute(
    `
      SELECT
        id,
        nombre,
        email,
        password_hash AS passwordHash,
        activo
      FROM administradores
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  return filas[0] || null;
};

export const actualizarUltimoAcceso = async (
  connection,
  administradorId
) => {
  await connection.execute(
    `
      UPDATE administradores
      SET ultimo_acceso = NOW()
      WHERE id = ?
    `,
    [administradorId]
  );
};