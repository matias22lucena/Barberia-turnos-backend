USE barberia_turnos;

INSERT INTO servicios (
    nombre,
    descripcion,
    duracion_minutos,
    precio
)
VALUES
(
    'Corte clásico',
    'Corte tradicional con terminación y peinado',
    30,
    5000.00
),
(
    'Corte + barba',
    'Servicio completo de corte y arreglo de barba',
    45,
    7500.00
),
(
    'Barba',
    'Perfilado, recorte y terminación de barba',
    30,
    4000.00
),
(
    'Perfilado de cejas',
    'Perfilado y terminación de cejas',
    20,
    2500.00
);