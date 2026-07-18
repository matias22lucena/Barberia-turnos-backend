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