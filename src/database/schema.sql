CREATE DATABASE IF NOT EXISTS barberia_turnos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE barberia_turnos;

CREATE TABLE IF NOT EXISTS servicios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    duracion_minutos SMALLINT UNSIGNED NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_servicios_duracion
        CHECK (duracion_minutos > 0),

    CONSTRAINT chk_servicios_precio
        CHECK (precio >= 0),

    UNIQUE KEY uk_servicios_nombre (nombre),
    INDEX idx_servicios_activo (activo)
);

CREATE TABLE IF NOT EXISTS barberos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NULL,
    descripcion VARCHAR(255) NULL,
    foto_url VARCHAR(500) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_barberos_activo (activo)
);

CREATE TABLE IF NOT EXISTS barbero_servicios (
    barbero_id INT UNSIGNED NOT NULL,
    servicio_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (barbero_id, servicio_id),

    CONSTRAINT fk_barbero_servicios_barbero
        FOREIGN KEY (barbero_id)
        REFERENCES barberos(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_barbero_servicios_servicio
        FOREIGN KEY (servicio_id)
        REFERENCES servicios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_barbero_servicios_servicio (servicio_id)
);

USE barberia_turnos;

DELETE FROM barbero_servicios;
DELETE FROM barberos;

ALTER TABLE barberos AUTO_INCREMENT = 1;

INSERT INTO barberos (
    nombre,
    apellido,
    descripcion,
    foto_url
)
VALUES (
    'Juan',
    NULL,
    'Barbero principal',
    NULL
);

INSERT INTO barbero_servicios (
    barbero_id,
    servicio_id
)
SELECT
    1,
    id
FROM servicios
WHERE activo = 1;


//feature/horarios-barbero
CREATE TABLE IF NOT EXISTS horarios_barberos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    barbero_id INT UNSIGNED NOT NULL,
    dia_semana TINYINT UNSIGNED NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_horarios_barbero
        FOREIGN KEY (barbero_id)
        REFERENCES barberos(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_dia_semana
        CHECK (dia_semana BETWEEN 1 AND 7),

    CONSTRAINT chk_horario_valido
        CHECK (hora_fin > hora_inicio),

    INDEX idx_horarios_barbero_dia (
        barbero_id,
        dia_semana,
        activo
    )
);

USE barberia_turnos;

CREATE TABLE IF NOT EXISTS clientes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_clientes_telefono (telefono)
);

CREATE TABLE IF NOT EXISTS turnos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(12) NOT NULL,
    cliente_id INT UNSIGNED NOT NULL,
    barbero_id INT UNSIGNED NOT NULL,
    servicio_id INT UNSIGNED NOT NULL,

    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,

    duracion_minutos SMALLINT UNSIGNED NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,

    observacion VARCHAR(500) NULL,

    estado ENUM(
        'CONFIRMADO',
        'CANCELADO',
        'COMPLETADO',
        'AUSENTE'
    ) NOT NULL DEFAULT 'CONFIRMADO',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_turnos_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_turnos_barbero
        FOREIGN KEY (barbero_id)
        REFERENCES barberos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_turnos_servicio
        FOREIGN KEY (servicio_id)
        REFERENCES servicios(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_turnos_duracion
        CHECK (duracion_minutos > 0),

    CONSTRAINT chk_turnos_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_turnos_horas
        CHECK (hora_fin > hora_inicio),

    UNIQUE KEY uk_turnos_codigo (codigo),

    INDEX idx_turnos_barbero_fecha (
        barbero_id,
        fecha,
        estado
    ),

    INDEX idx_turnos_cliente (cliente_id),

    INDEX idx_turnos_fecha_estado (
        fecha,
        estado
    )
);
/* admin  */
CREATE TABLE IF NOT EXISTS administradores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_administradores_email (email)
);