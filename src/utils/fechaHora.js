const ZONA_HORARIA = "America/Argentina/Buenos_Aires";

const obtenerParte = (partes, tipo) => {
  return partes.find((parte) => parte.type === tipo)?.value;
};

export const obtenerFechaHoraActualArgentina = () => {
  const formateador = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const partes = formateador.formatToParts(new Date());

  const anio = obtenerParte(partes, "year");
  const mes = obtenerParte(partes, "month");
  const dia = obtenerParte(partes, "day");
  const hora = obtenerParte(partes, "hour");
  const minuto = obtenerParte(partes, "minute");

  return {
    fecha: `${anio}-${mes}-${dia}`,
    hora: `${hora}:${minuto}`,
    minutosActuales: Number(hora) * 60 + Number(minuto),
  };
};