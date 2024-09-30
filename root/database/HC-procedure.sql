-- !ROL PROCEDURE

    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertRol(
            IN p_nombre VARCHAR(50)
        )
        BEGIN
            INSERT INTO Rol (nombre_rol) 
            VALUES (p_nombre);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectRol(
            IN p_id INT
        )
        BEGIN
            SELECT * FROM Rol WHERE id_rol = p_id;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateRol(
            IN p_id INT,
            IN p_modRol VARCHAR(50)
        )
        BEGIN
            UPDATE Rol
            SET nombre_rol = p_modRol
            WHERE id_rol = p_id;
        END$$
        DELIMITER ;
    
    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteRol(
            IN p_id INT
        )
        BEGIN
            DELETE FROM Rol 
            WHERE id_rol = p_id;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertRol('Administrador'); -- *Funcional
    -- CALL sp_selectRol(1); -- *Funcional
    -- CALL sp_updateRol(1, 'CEO'); -- *Funcional
    -- CALL sp_deleteRol(1); -- *Funcional
    -- !-------------------------------------------------------------------------------------

-- !CIUDAD PROCEDURE

    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertCiudad(
            IN p_ciudad VARCHAR(100)
        )
        BEGIN
            INSERT INTO Ciudad (nombre_ciudad)
            VALUES (p_ciudad);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectCiudad(
            IN p_id INT
        )
        BEGIN
            SELECT * FROM Ciudad
            WHERE id_ciudad = p_id;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateCiudad(
            IN p_id INT,
            IN p_modCiudad VARCHAR(100)
        )
        BEGIN
            UPDATE Ciudad
            SET nombre_ciudad = p_modCiudad
            WHERE id_ciudad = p_id;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteCiudad(
            IN p_id INT
        )
        BEGIN
            DELETE FROM Ciudad
            WHERE id_ciudad = p_id;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertCiudad('Bogota'); -- *Funcional
    -- CALL sp_selectCiudad(1); -- *Funcional
    -- CALL sp_updateCiudad(1, 'Medellin'); -- *Funcional
    -- CALL sp_deleteCiudad(1); -- *Funcional
    -- !-------------------------------------------------------------------------------------

-- !DIRECCION PROCEDURE

    -- ?Insertar
        DELIMITER $$
            CREATE PROCEDURE sp_insertDireccion(
                IN p_direccion VARCHAR(200),
                IN p_nombre_ciudad VARCHAR(100)
            )
            BEGIN
                -- declaramos una variable para almacenar el id de la ciudad 
                DECLARE v_id_ciudad INT;

                -- Buscar el id_ciudad usando el nombre de la ciudad
                SELECT id_ciudad 
                INTO v_id_ciudad
                FROM Ciudad
                WHERE nombre_ciudad = p_nombre_ciudad
                LIMIT 1;

                -- Verificar si la ciudad existe
                IF v_id_ciudad IS NOT NULL THEN
                    -- Insertar la dirección con el id_ciudad obtenido
                    INSERT INTO Direccion (direccion, id_ciudad)
                    VALUES (p_direccion, v_id_ciudad);
                ELSE
                    -- Manejar el caso cuando la ciudad no existe
                    SIGNAL SQLSTATE '45000' 
                    SET MESSAGE_TEXT = 'La ciudad especificada no existe.';
                END IF;

            END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectDireccion(
            IN p_id INT,
            IN p_direccion VARCHAR(200),
            IN p_ciudad VARCHAR(200)
        )
        BEGIN
            SELECT 
                Direccion.direccion AS 'Direccion',
                Ciudad.nombre_ciudad AS 'Ciudad'
            FROM 
                Direccion
            JOIN 
                Ciudad
            ON 
                Direccion.id_ciudad = Ciudad.id_ciudad
            WHERE 
            -- La condición solo se evalúa si p_id tiene un valor. Si es NULL, se ignora esa condición.
                (p_id IS NOT NULL AND Direccion.id_direccion = p_id)
                OR (p_direccion IS NOT NULL AND Direccion.direccion = p_direccion)
                OR (p_ciudad IS NOT NULL AND Ciudad.nombre_ciudad = p_ciudad);
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateDireccion(
            IN p_id_direccion INT,
            IN p_nueva_direccion VARCHAR(200),
            IN p_nombre_ciudad VARCHAR(100)
        )
        BEGIN
            DECLARE v_id_ciudad INT;

            -- Buscar el id_ciudad según el nombre de la ciudad
            SELECT id_ciudad 
            INTO v_id_ciudad
            FROM Ciudad
            WHERE nombre_ciudad = p_nombre_ciudad
            LIMIT 1;

            -- Verificar si se encontró la ciudad
            IF v_id_ciudad IS NOT NULL THEN
                -- Actualizar la dirección y la ciudad en la tabla Direccion
                UPDATE Direccion
                SET direccion = p_nueva_direccion, 
                    id_ciudad = v_id_ciudad
                WHERE id_direccion = p_id_direccion;
            ELSE
                -- Manejar el caso cuando la ciudad no se encuentra
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'La ciudad especificada no existe.';
            END IF;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteDireccion(
            IN p_id INT
        )
        BEGIN
            DELETE FROM Direccion
            WHERE id_direccion = p_id;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertDireccion('Carrera 80k #70-39','Medellin'); -- *Funcional
    -- CALL sp_selectCiudad(1, NULL, NULL); // CALL sp_selectCiudad(NULL, 'Calle 123 #45-67', NULL); // CALL sp_selectCiudad(NULL, NULL, 'Bogotá'); --*Funcional
    -- CALL sp_updateDireccion(1, 'Calle 456 #89-01', 'Medellín'); --*Funcional
    -- CALL sp_deleteDireccion(1); --*Funcional
    -- !-------------------------------------------------------------------------------------

-- !ESPECIALIDAD PROCEDURE  
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertEspecialidad(
            IN p_especialidad VARCHAR(255),
            IN p_costo DECIMAL(10,2)
        )
        BEGIN
                INSERT INTO Especialidad (nombre_especialidad, costo)
                VALUES (p_especialidad, p_costo);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectEspecialidad(
            p_id INT
        )
        BEGIN
            SELECT * FROM Especialidad 
            WHERE id_especialidad = p_id;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateEspecialidad(
            IN p_id INT,
            IN p_especialidad VARCHAR(255),
            IN p_costo DECIMAL(10,2)
        )
        BEGIN
            DECLARE v_exists INT;

            -- Verificar si la especialidad existe
            SELECT COUNT(*) INTO v_exists
            FROM Especialidad
            WHERE id_especialidad = p_id;

            -- Si no existe, lanzar un error
            IF v_exists = 0 THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'La especialidad no existe.';
            ELSE
                -- Realizar la actualización
                UPDATE Especialidad
                SET nombre_especialidad = p_especialidad,
                    costo = p_costo
                WHERE id_especialidad = p_id;
            END IF;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteEspecialidad(
            IN p_id INT
        )
        BEGIN
            DECLARE v_exists INT;

            -- Verificar si la especialidad existe
            SELECT COUNT(*) INTO v_exists
            FROM Especialidad
            WHERE id_especialidad = p_id;

            -- Si no existe, lanzar un error
            IF v_exists = 0 THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'La especialidad no existe.';
            ELSE
                -- Realizar la eliminación
                DELETE FROM Especialidad
                WHERE id_especialidad = p_id;
            END IF;
        END$$
        DELIMITER ;

    --? Calls
    -- CALL sp_insertEspecialidad('Pediatría', 200.00); -- *Funcional
    -- Call sp_selectEspecialidad(1); -- *Funcional
    -- CALL sp_updateEspecialidad(1, 'Cardiologia', 300.00); -- *Funcional
    -- CALL sp_deleteEspecialidad(1); -- *Funcional
    -- !-------------------------------------------------------------------------------------

-- !TIPOCITA PROCEDURE  
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertTipoCita(
            IN p_tipo VARCHAR(50),
            IN p_costo_adicional DECIMAL(10,2)
        )
        BEGIN
            INSERT INTO TipoCita (nombre_tipo, costo_adicional)
            VALUES (p_tipo, p_costo_adicional);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectTipoCita(
            IN p_id INT
        )
        BEGIN
            SELECT * FROM TipoCita 
            WHERE id_tipo = p_id;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateTipoCita(
            IN p_id INT,
            IN p_tipo VARCHAR(50),
            IN p_costo_adicional DECIMAL(10,2)
        )
        BEGIN
            -- Verificamos la existencia de el tipo de cita
            IF EXISTS (SELECT 1 FROM TipoCita WHERE id_tipo = p_id) THEN
                -- Realizar la actualización
                UPDATE TipoCita
                SET nombre_tipo = p_tipo,
                    costo_adicional = p_costo_adicional
                WHERE id_tipo = p_id;
            ELSE
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'El tipo de cita no existe.';
            END IF;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteTipoCita(
            IN p_id INT
        )
        BEGIN
            DECLARE v_tipo INT;

        
            SELECT COUNT(*) INTO v_tipo
            FROM TipoCita
            WHERE id_tipo = p_id;

            IF v_tipo = 0 THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'El tipo de cita no existe.';
            ELSE
                DELETE FROM TipoCita
                WHERE id_tipo = p_id;
            END IF;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertTipoCita('Consulta Médica', 50.00); -- *Funcional
    -- CALL sp_selectTipoCita(1); -- *Funcional
    -- CALL sp_updateTipoCita(1, 'Consulta General', 100.00); -- *Funcional
    -- CALL sp_deleteTipoCita(1); -- *Funcional

    -- !------------------------------------------------------------------------------------- 

-- !AFILIACION PROCEDURE  
    -- ?Insertar
        DELIMITER $$
            CREATE PROCEDURE sp_insertAfiliacion(
            IN p_nombre_plan VARCHAR(50),
            IN p_costo DECIMAL(10,2),
            IN p_descuento DECIMAL(5,2),
            IN p_beneficiarios INT,
            IN p_descripcion TEXT
            )
            BEGIN
                INSERT INTO Afiliacion (nombre_plan, costo, descuento, max_beneficiarios, descripcion)
                VALUES (p_nombre_plan, p_costo, p_descuento, p_beneficiarios, p_descripcion);
            END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectAfiliacion(
        IN p_id INT
        )
        BEGIN
            SELECT * FROM Afiliacion 
            WHERE id_afiliacion = p_id;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateAfiliacion(
            IN p_id INT,
            IN p_nombre_plan VARCHAR(50),
            IN p_costo DECIMAL(10,2),
            IN p_descuento DECIMAL(5,2),
            IN p_beneficiarios INT,
            IN p_descripcion TEXT
        )
        BEGIN
            UPDATE Afiliacion
            SET nombre_plan = p_nombre_plan,
                costo = p_costo,
                descuento = p_descuento,
                max_beneficiarios = p_beneficiarios,
                descripcion = p_descripcion
            WHERE id_afiliacion = p_id;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteAfiliacion(
            IN p_id INT
        )
        BEGIN
            DELETE FROM Afiliacion
            WHERE id_afiliacion = p_id;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertAfiliacion('Plan Básico', 100.00, 10.00, 5, 'Descripción del plan básico.'); -- *Funcional
    -- CALL sp_selectAfiliacion(1); -- *Funcional
    -- CALL sp_updateAfiliacion(1, 'Plan Avanzado', 150.00, 15.00, 10, 'Descripción del plan avanzado.'); -- *Funcional
    -- CALL sp_deleteAfiliacion(1); -- *Funcional
    -- !------------------------------------------------------------------------------------- 

-- !PACIENTE PROCEDURE  
    -- ?Insertar
    DELIMITER $$
    CREATE PROCEDURE sp_insertPaciente(
        IN p_documento INT, 
        IN p_nombre VARCHAR(100),
        IN p_apellido VARCHAR(100),
        IN p_tipo_doc VARCHAR(30),
        IN p_nacimiento DATE,
        IN p_genero CHAR(1),
        IN p_telefono VARCHAR(30),
        IN p_email VARCHAR(100),
        IN p_direccion VARCHAR(200),
        IN p_contraseña VARBINARY(255),
        IN p_plan_afiliacion INT,
        IN p_foto VARCHAR(255),
        IN p_estado ENUM('activo', 'inactivo'),
        IN p_afiliado BOOLEAN,
        IN p_ciudad VARCHAR(100)
    )
    BEGIN
        DECLARE v_id_direccion INT;
        -- usamos el procedimiento almacenado para insertar direccion
        CALL sp_insertDireccion(p_direccion, p_ciudad);

        -- obtenemos el ultimo id insertado en direccion
        SET v_id_direccion = LAST_INSERT_ID();

        INSERT INTO Paciente (numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_plan_afiliacion, foto_perfil, id_rol, estado, afiliado)
        VALUES(p_documento, p_nombre, p_apellido, p_tipo_doc, p_nacimiento, p_genero, p_telefono, p_email, v_id_direccion, p_contraseña, p_plan_afiliacion, p_foto, 1, p_estado, p_afiliado);
    END$$
    DELIMITER ;

    CALL sp_insertPaciente(2123456535,'Johny', "Molano Patiño", "C.C.", '2006-09-15', 'M', '3128040509','johnycito@gmail.com', 'DIAGONAL BRASA ROJA', '3312', NULL, 'johnyFoto.png', 'activo', FALSE, 'MEDELLIN');

    -- ?Consultar
    DELIMITER $$
    CREATE PROCEDURE sp_selectPaciente()
    BEGIN

    END$$
    DELIMITER ;

    -- ?Actualizar
    DELIMITER $$
    CREATE PROCEDURE sp_updatePaciente()
    BEGIN

    END$$
    DELIMITER ;

    -- ?Borrar
    DELIMITER $$
    CREATE PROCEDURE sp_deletePaciente()
    BEGIN

    END$$
    DELIMITER ;

    -- !------------------------------------------------------------------------------------- 






























    -- Consultas utiles 
    -- HOW PROCEDURE STATUS WHERE Db = 'Health_connection';
