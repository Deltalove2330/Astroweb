/* ============================================================
   MIGRACIÓN — Encuestador Médico + Dashboard Cliente (rol 13)
   Fecha: 2026-05-22
   ============================================================
   Este script:
     1) Crea la tabla JORNADAS_ENCUESTADOR (nueva — no existe).
     2) Asegura que las tablas del esquema médico existen
        (centros_salud, medicos, encuestas_centro,
         medico_centro_encuesta). Idempotente.
     3) Crea los índices que necesita el dashboard del cliente
        para que las agregaciones sean rápidas.
   ============================================================ */

-- 1. JORNADAS_ENCUESTADOR ------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'JORNADAS_ENCUESTADOR')
BEGIN
    CREATE TABLE JORNADAS_ENCUESTADOR (
        id_jornada      INT IDENTITY(1,1) PRIMARY KEY,
        id_usuario      INT NOT NULL,
        fecha_inicio    DATETIME2 NOT NULL DEFAULT GETDATE(),
        fecha_fin       DATETIME2 NULL,
        estado          VARCHAR(20) NOT NULL DEFAULT 'En Progreso',  -- 'En Progreso' | 'Finalizada'
        latitud         FLOAT NULL,
        longitud        FLOAT NULL,
        ciudad          VARCHAR(100) NULL,
        estado_geo      VARCHAR(100) NULL,
        notas           VARCHAR(MAX) NULL,
        CONSTRAINT FK_jornada_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    );
    CREATE INDEX idx_jornadas_usuario_estado ON JORNADAS_ENCUESTADOR(id_usuario, estado);
END
GO

-- 2. Asegurar tablas del esquema médico (idempotente) -------------------
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'centros_salud')
BEGIN
    CREATE TABLE centros_salud (
        id_centro           INT IDENTITY(1,1) PRIMARY KEY,
        nombre_centro       VARCHAR(255) NOT NULL,
        direccion_completa  VARCHAR(MAX) NOT NULL,
        ciudad              VARCHAR(100) NULL,
        estado              VARCHAR(100) NULL
    );
    CREATE INDEX idx_centros_nombre ON centros_salud(nombre_centro);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'medicos')
BEGIN
    CREATE TABLE medicos (
        id_medico               INT IDENTITY(1,1) PRIMARY KEY,
        id_medico_externo       VARCHAR(20) NOT NULL UNIQUE,
        apellido1               VARCHAR(100) NOT NULL,
        apellido2               VARCHAR(100) NULL,
        nombre1                 VARCHAR(100) NOT NULL,
        nombre2                 VARCHAR(100) NULL,
        especialidad            VARCHAR(100) NOT NULL,
        sub_especialidad        VARCHAR(100) NULL,
        universidad_graduacion  VARCHAR(255) NULL,
        nro_MPPS                VARCHAR(50) NULL,
        nro_colegiado           VARCHAR(50) NULL,
        ciudad                  VARCHAR(100) NOT NULL,
        estado                  VARCHAR(100) NOT NULL,
        telefono                VARCHAR(20) NULL,
        whatsapp                VARCHAR(20) NULL,
        email                   VARCHAR(100) NULL,
        linkedin                VARCHAR(255) NULL,
        instagram               VARCHAR(255) NULL,
        fecha_registro          DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_medicos_identidad ON medicos(id_medico_externo);
    CREATE INDEX idx_medicos_apellido ON medicos(apellido1, nombre1);
    CREATE INDEX idx_medicos_especialidad ON medicos(especialidad);
    CREATE INDEX idx_medicos_estado ON medicos(estado);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'encuestas_centro')
BEGIN
    CREATE TABLE encuestas_centro (
        id_encuesta         INT IDENTITY(1,1) PRIMARY KEY,
        id_usuario          INT NOT NULL,
        id_centro           INT NOT NULL,
        id_jornada          INT NULL,                         -- vínculo opcional a JORNADAS_ENCUESTADOR
        fecha_verificacion  DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
        fuente_informacion  VARCHAR(255) NOT NULL DEFAULT 'Visita presencial',
        notas_generales     VARCHAR(MAX) NULL,
        estado              VARCHAR(20) NOT NULL DEFAULT 'Abierta', -- 'Abierta' | 'Cerrada'
        creado_en           DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_encuestas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
        CONSTRAINT FK_encuestas_centro  FOREIGN KEY (id_centro)  REFERENCES centros_salud(id_centro),
        CONSTRAINT FK_encuestas_jornada FOREIGN KEY (id_jornada) REFERENCES JORNADAS_ENCUESTADOR(id_jornada)
    );
    CREATE INDEX idx_encuestas_fecha ON encuestas_centro(fecha_verificacion);
    CREATE INDEX idx_encuestas_jornada ON encuestas_centro(id_jornada);
END
ELSE
BEGIN
    -- Si la tabla ya existía sin id_jornada/estado, añadirlos
    IF NOT EXISTS (SELECT 1 FROM sys.columns
                    WHERE Name = 'id_jornada'
                      AND Object_ID = Object_ID('encuestas_centro'))
        ALTER TABLE encuestas_centro ADD id_jornada INT NULL;

    IF NOT EXISTS (SELECT 1 FROM sys.columns
                    WHERE Name = 'estado'
                      AND Object_ID = Object_ID('encuestas_centro'))
        ALTER TABLE encuestas_centro ADD estado VARCHAR(20) NOT NULL DEFAULT 'Abierta';
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'medico_centro_encuesta')
BEGIN
    CREATE TABLE medico_centro_encuesta (
        id_medico_centro                    INT IDENTITY(1,1) PRIMARY KEY,
        id_encuesta                         INT NOT NULL,
        id_medico                           INT NOT NULL,

        piso_consultorio                    VARCHAR(50)  NULL,
        horarios_consulta                   VARCHAR(255) NULL,
        dias_consulta                       VARCHAR(255) NULL,
        direccion_especifica                VARCHAR(MAX) NULL,

        clinica2_nombre                     VARCHAR(255) NULL,
        piso_consultorio2                   VARCHAR(50)  NULL,
        horarios_consulta2                  VARCHAR(255) NULL,
        dias_consulta2                      VARCHAR(255) NULL,
        direccion_especifica2               VARCHAR(MAX) NULL,

        valor_consulta_rango                VARCHAR(30) NOT NULL,
        promedio_pacientes_semanal_rango    VARCHAR(30) NOT NULL,

        actualizado_en                      DATETIME2 DEFAULT GETDATE(),

        CONSTRAINT FK_mce_encuesta FOREIGN KEY (id_encuesta) REFERENCES encuestas_centro(id_encuesta),
        CONSTRAINT FK_mce_medico   FOREIGN KEY (id_medico)   REFERENCES medicos(id_medico)
    );
    CREATE INDEX idx_medico_centro_encuesta ON medico_centro_encuesta(id_encuesta, id_medico);
    CREATE INDEX idx_mce_valor ON medico_centro_encuesta(valor_consulta_rango);
END
GO

PRINT '✅ Migración encuestador médico aplicada.';
