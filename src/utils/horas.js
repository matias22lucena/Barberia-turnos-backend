export const convertirHoraAMinutos = (hora) => {
  const [horas, minutos] = hora.split(":").map(Number);

  return horas * 60 + minutos;
};

export const convertirMinutosAHora = (minutosTotales) => {
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
    2,
    "0"
  )}`;
};

export const generarHorariosDeFranja = ({
  horaInicio,
  horaFin,
  duracionServicio,
  intervaloMinutos = 30,
}) => {
  const horarios = [];

  const inicioEnMinutos = convertirHoraAMinutos(horaInicio);
  const finEnMinutos = convertirHoraAMinutos(horaFin);

  for (
    let inicioTurno = inicioEnMinutos;
    inicioTurno + duracionServicio <= finEnMinutos;
    inicioTurno += intervaloMinutos
  ) {
    horarios.push(convertirMinutosAHora(inicioTurno));
  }

  return horarios;
};