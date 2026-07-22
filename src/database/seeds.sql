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


INSERT INTO barberos (
    nombre,
    apellido,
    descripcion,
    foto_url
)
VALUES
(
    'Juan',
    NULL,
    'Fades y cortes clásicos',
    NULL
),
(
    'Facundo',
    NULL,
    'Diseños y degradados',
    NULL
),
(
    'Matías',
    NULL,
    'Barba y navaja',
    NULL
);

INSERT IGNORE INTO barbero_servicios (
    barbero_id,
    servicio_id
)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),

    (2, 1),
    (2, 2),
    (2, 4),

    (3, 1),
    (3, 2),
    (3, 3);