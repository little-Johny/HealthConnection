/* TABLA FUNCIONARIO_HAS_CITAS */

--insertar FuncionarioCitas
DELIMITER $$
CREATE PROCEDURE InsertarFuncionarioCita(
    IN p_id_funcionario INT,
    IN p_id_cita INT,
    IN p_participacion ENUM('Asignador', 'Atendió')
)
BEGIN
    -- Verificar que el funcionario y la cita existen
    IF EXISTS (SELECT 1 FROM Funcionario WHERE id_funcionario = p_id_funcionario) AND
    EXISTS (SELECT 1 FROM Cita WHERE id_cita = p_id_cita) THEN

        -- Insertar en la tabla de relación
        INSERT INTO Funcionario_has_Cita (id_funcionario, id_cita, participacion)
        VALUES (p_id_funcionario, p_id_cita, p_participacion);
    ELSE
        -- Error si el funcionario o la cita no existen
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Funcionario o Cita no encontrados';
    END IF;
END$$
DELIMITER ;

-- Actualizacion de datos en funcionarioCita
DELIMITER $$
CREATE PROCEDURE ActualizarFuncionarioCita(
    IN p_id_funcionario_actual INT,
    IN p_id_cita_actual INT,
    IN p_id_funcionario_nuevo INT,
    IN p_id_cita_nueva INT,
    IN p_participacion_nueva ENUM('Asignador', 'Atendió')
)
BEGIN
    -- Verificar que el nuevo funcionario y la nueva cita existen
    IF EXISTS (SELECT 1 FROM Funcionario WHERE id_funcionario = p_id_funcionario_nuevo) AND
    EXISTS (SELECT 1 FROM Cita WHERE id_cita = p_id_cita_nueva) THEN

        -- Actualizar en la tabla de relación
        UPDATE Funcionario_has_Cita
        SET id_funcionario = p_id_funcionario_nuevo, 
            id_cita = p_id_cita_nueva, 
            participacion = p_participacion_nueva
        WHERE id_funcionario = p_id_funcionario_actual AND id_cita = p_id_cita_actual;
    ELSE
        -- Error si el funcionario o la cita no existen
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Funcionario o Cita no encontrados';
    END IF;
END$$
DELIMITER ;

-- Eliminar FuncionarioCitas
DELIMITER $$
CREATE PROCEDURE EliminarFuncionarioCita(
    IN p_id_funcionario INT,
    IN p_id_cita INT
)
BEGIN
    -- Eliminar el registro de la tabla de relación
    DELETE FROM Funcionario_has_Cita
    WHERE id_funcionario = p_id_funcionario AND id_cita = p_id_cita;
END$$
DELIMITER ;


-- Consultar FuncionarioCita
DELIMITER $$
CREATE PROCEDURE ConsultarFuncionarioCita()
BEGIN
    -- Consulta con JOIN para mostrar datos de la tabla relacional y las tablas principales
    SELECT f.nombre, f.apellido, c.fecha_cita, fc.participacion
    FROM Funcionario_has_Cita fc
    JOIN Funcionario f ON fc.id_funcionario = f.id_funcionario
    JOIN Cita c ON fc.id_cita = c.id_cita;
END$$
DELIMITER ;


/* TABLA CITAS_HAS_ESTADO */
--insertar funcionarioCita
DELIMITER $$
CREATE PROCEDURE InsertarCitaEstado(
    IN p_id_cita INT,
    IN p_id_estado INT
)
BEGIN
    -- Verificar que la cita y el estado existen
    IF EXISTS (SELECT 1 FROM Cita WHERE id_cita = p_id_cita) AND
       EXISTS (SELECT 1 FROM EstadosDeCita WHERE id_estado = p_id_estado) THEN

        -- Insertar en la tabla de relación
        INSERT INTO Cita_has_Estados (id_cita, id_estado)
        VALUES (p_id_cita, p_id_estado);
    ELSE
        -- Error si la cita o el estado no existen
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cita o Estado no encontrados';
    END IF;
END$$
DELIMITER ;

--actualizar funcionarioCita
DELIMITER $$
CREATE PROCEDURE ActualizarCitaEstado(
    IN p_id_cita_actual INT,
    IN p_id_estado_actual INT,
    IN p_id_cita_nueva INT,
    IN p_id_estado_nuevo INT
)
BEGIN
    -- Verificar que la nueva cita y el nuevo estado existen
    IF EXISTS (SELECT 1 FROM Cita WHERE id_cita = p_id_cita_nueva) AND
       EXISTS (SELECT 1 FROM EstadosDeCita WHERE id_estado = p_id_estado_nuevo) THEN

        -- Actualizar en la tabla de relación
        UPDATE Cita_has_Estados
        SET id_cita = p_id_cita_nueva, 
            id_estado = p_id_estado_nuevo
        WHERE id_cita = p_id_cita_actual AND id_estado = p_id_estado_actual;
    ELSE
        -- Error si la cita o el estado no existen
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cita o Estado no encontrados';
    END IF;
END$$
DELIMITER ;


-- Eliminar FuncionarioCita
DELIMITER $$
CREATE PROCEDURE EliminarCitaEstado(
    IN p_id_cita INT,
    IN p_id_estado INT
)
BEGIN
    -- Eliminar el registro de la tabla de relación
    DELETE FROM Cita_has_Estados
    WHERE id_cita = p_id_cita AND id_estado = p_id_estado;
END$$
DELIMITER ;

--Consultar FuncionarioCita
DELIMITER $$
CREATE PROCEDURE ConsultarCitaEstado()
BEGIN
    -- Consulta con JOIN para mostrar datos de la tabla relacional y las tablas principales
    SELECT c.fecha_cita, e.descripcion, ce.id_estado, ce.id_cita
    FROM Cita_has_Estados ce
    JOIN Cita c ON ce.id_cita = c.id_cita
    JOIN EstadosDeCita e ON ce.id_estado = e.id_estado;
END$$
DELIMITER ;


/* COMO SE LLAMAN ESTOS PROCEDIMIENTOS */

-- CALL InsertarFuncionarioCita(1, 101, 'Asignador');
-- CALL ActualizarFuncionarioCita(1, 101, 2, 102, 'Atendió');
-- CALL EliminarFuncionarioCita(1, 101);
-- CALL ConsultarFuncionarioCita();


-- CALL InsertarCitaEstado(101, 5);
-- CALL ActualizarCitaEstado(101, 5, 102, 6);
-- CALL EliminarCitaEstado(101, 5);
-- CALL ConsultarCitaEstado();


/* VISTAS Simples */

CREATE VIEW Vista_Funcionario_Cita AS
SELECT 
    f.id_funcionario,
    f.nombre AS nombre_funcionario,
    f.apellido AS apellido_funcionario,
    f.email AS email_funcionario,
    c.id_cita,
    c.fecha_cita,
    c.documento_paciente,
    fc.participacion
FROM 
    Funcionario_has_Cita fc
JOIN 
    Funcionario f ON fc.id_funcionario = f.id_funcionario
JOIN 
    Cita c ON fc.id_cita = c.id_cita;

/* Llamada de esta vista
SELECT * FROM Vista_Funcionario_Cita;
 */

CREATE VIEW Vista_Cita_Estado AS
SELECT 
    c.id_cita,
    c.fecha_cita,
    c.documento_paciente,
    e.id_estado,
    e.descripcion AS estado_descripcion,
    e.fecha_registro
FROM 
    Cita_has_Estados ce
JOIN 
    Cita c ON ce.id_cita = c.id_cita
JOIN 
    EstadosDeCita e ON ce.id_estado = e.id_estado;

/* Llamada de esta vista
SELECT * FROM Vista_Cita_Estado;
 */