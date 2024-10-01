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
    -- CALL sp_selectDireccion(1, NULL, NULL); // CALL sp_selectDireccion(NULL, 'Calle 123 #45-67', NULL); // CALL sp_selectDireccion(NULL, NULL, 'Bogotá'); --*Funcional
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

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectPaciente(
            IN p_documento INT
        )
        BEGIN
            SELECT 
                Paciente.*, 
                Direccion.direccion AS 'Direccion',  
                Ciudad.nombre_ciudad AS 'Ciudad'
            FROM Paciente
            JOIN Direccion 
            ON Paciente.direccion = Direccion.id_direccion
            JOIN Ciudad
            ON Direccion.id_ciudad = Ciudad.id_ciudad
            WHERE Paciente.numero_documento = p_documento;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updatePaciente(
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
            IN p_estado VARCHAR(15),
            IN p_afiliado BOOLEAN,
            IN p_ciudad VARCHAR(100)
        )
        BEGIN
            DECLARE v_id_direccion INT;

            -- Usamos el procedimiento almacenado para actualizar/insetar la dirección
            CALL sp_insertDireccion(p_direccion, p_ciudad);

            -- Obtener el último ID insertado en dirección
            SET v_id_direccion = LAST_INSERT_ID();

            -- Actualizar los datos del paciente
            UPDATE Paciente
            SET nombre = p_nombre,
                apellido = p_apellido,
                tipo_doc = p_tipo_doc,
                fecha_de_nacimiento = p_nacimiento,
                genero = p_genero,
                telefono = p_telefono,
                email = p_email,
                direccion = v_id_direccion,  -- Actualiza con el nuevo ID de dirección
                contraseña = p_contraseña,
                id_plan_afiliacion = p_plan_afiliacion,
                foto_perfil = p_foto,
                estado = p_estado,
                afiliado = p_afiliado
            WHERE numero_documento = p_documento;
        END$$
        DELIMITER ;

    -- ?Borrar(Desactivar)
        DELIMITER $$
            CREATE PROCEDURE sp_toggleEstadoPaciente(
                IN p_documento INT  
            )
            BEGIN
                DECLARE v_estado_actual ENUM('activo', 'inactivo');

                -- Consultamos el estado actual del paciente
                SELECT estado INTO v_estado_actual
                FROM Paciente
                WHERE numero_documento = p_documento;

                -- cambiamos el estado del paciente al contrario del que tenga actualmente
                IF v_estado_actual = 'activo' THEN
                    UPDATE Paciente
                    SET estado = 'inactivo'
                    WHERE numero_documento = p_documento;
                ELSEIF v_estado_actual = 'inactivo' THEN
                    UPDATE Paciente
                    SET estado = 'activo'
                    WHERE numero_documento = p_documento;
                END IF;
            END$$
        DELIMITER ;


    -- ?Calls
    -- CALL sp_insertPaciente(2123456535,'Johny', "Molano Patiño", "C.C.", '2006-09-15', 'M', '3128040509','johnycito@gmail.com', 'DIAGONAL BRASA ROJA', '3312', NULL, 'johnyFoto.png', 'activo', FALSE, 'Medellin'); -- *Funcional
    -- CALL sp_selectPaciente(1012345424); --*Funcional
    -- CALL CALL sp_updatePaciente(1012345424, 'Juan', 'Pérez', 'C.C.', '1990-01-01', 'M', '3128040509', 'juan.perez@example.com', 'Nueva Calle 123', 'password123', 1, 'juan_foto.jpg', 'activo', TRUE, 'Bogotá'); -- *Funcional
    -- CALL sp_toggleEstadoPaciente(1012345424); -- *Funcional

    -- !------------------------------------------------------------------------------------- 

-- !DOCTOR PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertDoctor(
            IN p_nombre VARCHAR(100),
            IN p_apellido VARCHAR(100),
            IN p_tipo_documento VARCHAR(30),
            IN p_numero_documento INT,
            IN p_telefono VARCHAR(30),
            IN p_email VARCHAR(100),
            IN p_direccion VARCHAR(200),
            IN p_ciudad VARCHAR(100),  
            IN p_especialidad VARCHAR(100),  
            IN p_contraseña VARBINARY(255),
            IN p_foto_perfil VARCHAR(255),
            IN p_genero CHAR(1)
        )
        BEGIN
            DECLARE v_id_direccion INT;
            DECLARE v_id_especialidad INT;

            -- Llamar al procedimiento almacenado para insertar la dirección
            CALL sp_insertDireccion(p_direccion, p_ciudad);

            -- Obtener el último ID insertado en dirección
            SET v_id_direccion = LAST_INSERT_ID();

            -- Verificar que se haya insertado una dirección
            IF v_id_direccion IS NULL THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar la dirección.';
            END IF;

            -- Buscar el id_especialidad usando el nombre de la especialidad
            SELECT id_especialidad 
            INTO v_id_especialidad
            FROM Especialidad
            WHERE nombre_especialidad = p_especialidad
            LIMIT 1;

            -- Verificar si se encontró la especialidad
            IF v_id_especialidad IS NOT NULL THEN
                -- Insertar un nuevo doctor con el id_especialidad obtenido
                INSERT INTO Doctor (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, id_especialidad, contraseña, foto_perfil, genero, id_rol)
                VALUES (p_nombre, p_apellido, p_tipo_documento, p_numero_documento, p_telefono, p_email, v_id_direccion, v_id_especialidad, p_contraseña, p_foto_perfil, p_genero, 2);  -- id_rol es 2 para doctor
            ELSE
                -- Manejar el caso cuando la especialidad no existe
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'La especialidad especificada no existe.';
            END IF;
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectDoctor(
            IN p_numero_documento INT  -- Número de documento del doctor
        )
        BEGIN
            SELECT 
                Doctor.id_doctor, Doctor.nombre, Doctor.apellido, Doctor.tipo_documento, Doctor.numero_documento, Doctor.telefono, Doctor.email, 
                Direccion.direccion AS 'Direccion',  
                Ciudad.nombre_ciudad AS 'Ciudad',
                Especialidad.nombre_especialidad AS 'Especialidad', 
                Doctor.foto_perfil, 
                Doctor.genero
            FROM Doctor
            JOIN Direccion 
                ON Doctor.direccion = Direccion.id_direccion
            JOIN Ciudad 
                ON Direccion.id_ciudad = Ciudad.id_ciudad
            JOIN Especialidad 
                ON Doctor.id_especialidad = Especialidad.id_especialidad
            WHERE Doctor.numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateDoctor(
            IN p_numero_documento INT,      
            IN p_nombre VARCHAR(100),        
            IN p_apellido VARCHAR(100),      
            IN p_tipo_documento VARCHAR(30), 
            IN p_telefono VARCHAR(30),       
            IN p_email VARCHAR(100),         
            IN p_direccion VARCHAR(200),     
            IN p_ciudad VARCHAR(100),        
            IN p_especialidad VARCHAR(100),  
            IN p_contraseña VARBINARY(255),  
            IN p_foto_perfil VARCHAR(255),   
            IN p_genero CHAR(1)              
        )
        BEGIN
            DECLARE v_id_direccion INT;
            DECLARE v_id_especialidad INT;

            -- Obtenemos el ID de la dirección actual del doctor mediante esta consulta
            SELECT direccion INTO v_id_direccion
            FROM Doctor
            WHERE numero_documento = p_numero_documento;

            -- Actualizar la dirección y la ciudad usando el procedimiento almacenado
            CALL sp_updateDireccion(v_id_direccion, p_direccion, p_ciudad);

            -- Buscar el id_especialidad usando el nombre de la especialidad
            SELECT id_especialidad INTO v_id_especialidad
            FROM Especialidad
            WHERE nombre_especialidad = p_especialidad
            LIMIT 1;

            -- Verificar si se encontró la especialidad
            IF v_id_especialidad IS NOT NULL THEN
                -- Actualizar los detalles del doctor
                UPDATE Doctor
                SET nombre = p_nombre,
                    apellido = p_apellido,
                    tipo_documento = p_tipo_documento,
                    telefono = p_telefono,
                    email = p_email,
                    direccion = v_id_direccion,
                    id_especialidad = v_id_especialidad,
                    contraseña = p_contraseña,
                    foto_perfil = p_foto_perfil,
                    genero = p_genero
                WHERE numero_documento = p_numero_documento;
            ELSE
                -- Manejar el caso cuando la especialidad no existe
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'La especialidad especificada no existe.';
            END IF;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteDoctor(
            IN p_numero_documento INT  -- Número de documento del doctor a eliminar
        )
        BEGIN
            -- Eliminar el doctor basado en el número de documento
            DELETE FROM Doctor
            WHERE numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertDoctor('Juan', 'Pérez', 'C.C.', 10123456, '3001234567', 'juan.perez@example.com', 'Calle 123', 'Bogotá', 'Cardiología', 'password', 'juan_foto.jpg', 'M'); -- *Funcional
    -- CALL sp_selectDoctor(10123456); -- *Funcional
    -- CALL sp_updateDoctor(10123456, 'Juan Carlos', 'Pérez', 'C.C.', '3009876543', 'juan.perez_new@example.com', 'Nueva Calle 123', 'Bogotá', 'Cardiología', 'newpassword', 'juan_foto_nueva.jpg', 'M'); -- *Funcional
    -- CALL sp_deleteDoctor(10123456); -- *Funcional




    -- !---------------------------------------------------------------------------------------

-- !ADMINISTRATIVOS PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertAdministrativo(
            IN p_nombre VARCHAR(100),
            IN p_apellido VARCHAR(100),
            IN p_tipo_documento VARCHAR(30),
            IN p_numero_documento INT,
            IN p_telefono VARCHAR(30),
            IN p_email VARCHAR(100),
            IN p_direccion VARCHAR(200),  
            IN p_ciudad VARCHAR(100),     
            IN p_contraseña VARBINARY(255) 
        )
        BEGIN
            DECLARE v_id_direccion INT;

            -- Llamar al procedimiento para insertar la dirección
            CALL sp_insertDireccion(p_direccion, p_ciudad);

            -- Obtener el último ID insertado en dirección
            SET v_id_direccion = LAST_INSERT_ID();

            -- Insertar el nuevo administrativo
            INSERT INTO Administrativos (nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña)
            VALUES (p_nombre, p_apellido, 3, p_tipo_documento, p_numero_documento, p_telefono, p_email, v_id_direccion, p_contraseña);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectAdministrativo(
            IN p_numero_documento INT
        )
        BEGIN
            SELECT 
                Administrativos.nombre, 
                Administrativos.apellido, 
                Administrativos.tipo_documento, 
                Administrativos.numero_documento, 
                Administrativos.telefono, 
                Administrativos.email, 
                Direccion.direccion AS 'Direccion', 
                Ciudad.nombre_ciudad AS 'Ciudad'  
            FROM Administrativos
            JOIN Direccion ON Administrativos.direccion = Direccion.id_direccion
            JOIN Ciudad ON Direccion.id_ciudad = Ciudad.id_ciudad
            WHERE Administrativos.numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateAdministrativo(
            IN p_numero_documento INT,      
            IN p_nombre VARCHAR(100),
            IN p_apellido VARCHAR(100),                
            IN p_tipo_documento VARCHAR(30),
            IN p_telefono VARCHAR(30),
            IN p_email VARCHAR(100),
            IN p_direccion VARCHAR(200),     
            IN p_ciudad VARCHAR(100),        
            IN p_contraseña VARBINARY(255)   
        )
        BEGIN
            DECLARE v_id_direccion INT;

            -- Obtener el ID de la dirección actual del administrativo
            SELECT direccion INTO v_id_direccion
            FROM Administrativos
            WHERE numero_documento = p_numero_documento;

            -- Actualizar la dirección y la ciudad
            CALL sp_updateDireccion(v_id_direccion, p_direccion, p_ciudad);

            -- Actualizar los detalles del administrativo
            UPDATE Administrativos
            SET nombre = p_nombre,
                apellido = p_apellido,
                tipo_documento = p_tipo_documento,
                telefono = p_telefono,
                email = p_email,
                direccion = v_id_direccion,
                contraseña = p_contraseña
            WHERE numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteAdministrativo(
            IN p_numero_documento INT
        )
        BEGIN
            -- Eliminar el administrativo basado en el número de documento
            DELETE FROM Administrativos
            WHERE numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertAdministrativo('Juan', 'Pérez', 'C.C.', 10123456, '3001234567', 'juan.perez@example.com', 'Calle 123', 'Bogotá', 'password'); -- *Funcional
    -- CALL sp_selectAdministrativo(10123456); -- *Funcional
    -- CALL sp_updateAdministrativo(10123456, 'Juan Carlos', 'Pérez', 'C.C.', '3009876543', 'juan.perez_new@example.com', 'Nueva Calle 456', 'Bogotá', 'newpassword'); -- *Funcional
    -- CALL sp_deleteAdministrativo(10123456); -- *Funcional




    -- !---------------------------------------------------------------------------------------

-- !SECRETARIA PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertSecretaria(
            IN p_nombre VARCHAR(100),
            IN p_apellido VARCHAR(100),
            IN p_tipo_documento VARCHAR(30),
            IN p_numero_documento INT,
            IN p_telefono VARCHAR(30),
            IN p_email VARCHAR(100),
            IN p_direccion VARCHAR(200),  
            IN p_ciudad VARCHAR(100),     
            IN p_contraseña VARBINARY(255) 
        )
        BEGIN
            DECLARE v_id_direccion INT;

            -- Llamar al procedimiento para insertar la dirección
            CALL sp_insertDireccion(p_direccion, p_ciudad);

            -- Obtener el último ID insertado en dirección
            SET v_id_direccion = LAST_INSERT_ID();

            -- Insertar el nuevo Secretaria
            INSERT INTO Secretaria (nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña)
            VALUES (p_nombre, p_apellido, 3, p_tipo_documento, p_numero_documento, p_telefono, p_email, v_id_direccion, p_contraseña);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectSecretaria(
            IN p_numero_documento INT
        )
        BEGIN
            SELECT 
                Secretaria.nombre, 
                Secretaria.apellido, 
                Secretaria.tipo_documento, 
                Secretaria.numero_documento, 
                Secretaria.telefono, 
                Secretaria.email, 
                Direccion.direccion AS 'Direccion', 
                Ciudad.nombre_ciudad AS 'Ciudad'  
            FROM Secretaria
            JOIN Direccion ON Secretaria.direccion = Direccion.id_direccion
            JOIN Ciudad ON Direccion.id_ciudad = Ciudad.id_ciudad
            WHERE Secretaria.numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateSecretaria(
            IN p_numero_documento INT,      
            IN p_nombre VARCHAR(100),
            IN p_apellido VARCHAR(100),                
            IN p_tipo_documento VARCHAR(30),
            IN p_telefono VARCHAR(30),
            IN p_email VARCHAR(100),
            IN p_direccion VARCHAR(200),     
            IN p_ciudad VARCHAR(100),        
            IN p_contraseña VARBINARY(255)   
        )
        BEGIN
            DECLARE v_id_direccion INT;

            -- Obtener el ID de la dirección actual del Secretaria
            SELECT direccion INTO v_id_direccion
            FROM Secretaria
            WHERE numero_documento = p_numero_documento;

            -- Actualizar la dirección y la ciudad
            CALL sp_updateDireccion(v_id_direccion, p_direccion, p_ciudad);

            -- Actualizar los detalles del Secretaria
            UPDATE Secretaria
            SET nombre = p_nombre,
                apellido = p_apellido,
                tipo_documento = p_tipo_documento,
                telefono = p_telefono,
                email = p_email,
                direccion = v_id_direccion,
                contraseña = p_contraseña
            WHERE numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteSecretaria(
            IN p_numero_documento INT
        )
        BEGIN
            -- Eliminar el Secretaria basado en el número de documento
            DELETE FROM Secretaria
            WHERE numero_documento = p_numero_documento;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertSecretaria('Juan', 'Pérez', 'C.C.', 10123456, '3001234567', 'juan.perez@example.com', 'Calle 123', 'Bogotá', 'password'); -- *Funcional
    -- CALL sp_selectSecretaria(10123456); -- *Funcional
    -- CALL sp_updateSecretaria(10123456, 'Juan Carlos', 'Pérez', 'C.C.', '3009876543', 'juan.perez_new@example.com', 'Nueva Calle 456', 'Bogotá', 'newpassword'); -- *Funcional
    -- CALL sp_deleteSecretaria(10123456); -- *Funcional




    -- !---------------------------------------------------------------------------------------

-- !ESTADO PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertEstado(
            IN p_nombre_estado VARCHAR(50)
        )
        BEGIN
            -- Insertar un nuevo estado
            INSERT INTO Estado (nombre_estado)
            VALUES (p_nombre_estado);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectEstado(
            IN p_id_estado INT
        )
        BEGIN
            SELECT id_estado, nombre_estado
            FROM Estado
            WHERE id_estado = p_id_estado;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateEstado(
            IN p_id_estado INT,
            IN p_nombre_estado VARCHAR(50)
        )
        BEGIN
            UPDATE Estado
            SET nombre_estado = p_nombre_estado
            WHERE id_estado = p_id_estado;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteEstado(
            IN p_id_estado INT
        )
        BEGIN
            DELETE FROM Estado
            WHERE id_estado = p_id_estado;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertEstado('Activo'); -- *Funcional
    -- CALL sp_selectEstado(1); -- *Funcional
    -- CALL sp_updateEstado(1, 'Inactivo'); -- *Funcional
    -- CALL sp_deleteEstado(1);




    -- !--------------------------------------------------------------------------------------

-- !CITA PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertCita(
            IN p_numero_paciente INT,       
            IN p_id_doctor INT,             
            IN p_tipo_solicitante VARCHAR(10),  -- Cambiado de ENUM a VARCHAR(10)
            IN p_asignador INT,             
            IN p_solicitante INT,           
            IN p_fecha DATE,                
            IN p_hora TIME,                 
            IN p_tipo_cita_nombre VARCHAR(50), 
            IN p_costo DECIMAL(10,2),       
            IN p_especialidad_nombre VARCHAR(100),
            IN p_requiere_autorizacion BOOLEAN,  
            IN p_documento_autorizacion VARCHAR(255) 
        )
        BEGIN
            DECLARE v_id_tipo_cita INT;
            DECLARE v_id_especialidad INT;

            -- Buscar el ID del tipo de cita
            SELECT id_tipo INTO v_id_tipo_cita
            FROM TipoCita
            WHERE nombre_tipo = p_tipo_cita_nombre
            LIMIT 1;

            -- Buscar el ID de la especialidad
            SELECT id_especialidad INTO v_id_especialidad
            FROM Especialidad
            WHERE nombre_especialidad = p_especialidad_nombre
            LIMIT 1;

            INSERT INTO Cita 
            (id_paciente, id_doctor, asignador, solicitante, tipo_solicitante, fecha, hora, tipo_cita, costo, especialidad, requiere_autorizacion, documento_autorizacion, estado) 
            VALUES 
            (p_numero_paciente, p_id_doctor, p_asignador, p_solicitante, p_tipo_solicitante, p_fecha, p_hora, v_id_tipo_cita, p_costo, v_id_especialidad, p_requiere_autorizacion, p_documento_autorizacion, 1);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectCita(
            IN p_id_cita INT
        )
        BEGIN
            SELECT 
                Cita.id_cita,
                Paciente.nombre AS paciente_nombre,
                Doctor.nombre AS doctor_nombre,
                Cita.tipo_solicitante,
                Administrativos.nombre AS asignador_nombre,
                Cita.fecha,
                Cita.hora,
                TipoCita.nombre_tipo AS tipo_cita,
                Cita.costo,
                Especialidad.nombre_especialidad AS especialidad,
                Cita.requiere_autorizacion,
                Cita.documento_autorizacion,
                Estado.nombre_estado AS estado
            FROM Cita
            JOIN Paciente ON Cita.id_paciente = Paciente.numero_documento
            JOIN Doctor ON Cita.id_doctor = Doctor.id_doctor
            LEFT JOIN Administrativos ON Cita.asignador = Administrativos.id_Administrativos
            JOIN TipoCita ON Cita.tipo_cita = TipoCita.id_tipo
            JOIN Especialidad ON Cita.especialidad = Especialidad.id_especialidad
            JOIN Estado ON Cita.estado = Estado.id_estado
            WHERE Cita.id_cita = p_id_cita;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateCita(
            IN p_id_cita INT,
            IN p_numero_paciente INT,       
            IN p_id_doctor INT,             
            IN p_tipo_solicitante VARCHAR(15),
            IN p_asignador INT,             
            IN p_solicitante INT,           
            IN p_fecha DATE,                
            IN p_hora TIME,                 
            IN p_tipo_cita_nombre VARCHAR(50), 
            IN p_costo DECIMAL(10,2),       
            IN p_especialidad_nombre VARCHAR(100), 
            IN p_requiere_autorizacion BOOLEAN,
            IN p_documento_autorizacion VARCHAR(255), 
            IN p_estado_nombre VARCHAR(50)  
        )
        BEGIN
            DECLARE v_id_tipo_cita INT;
            DECLARE v_id_especialidad INT;
            DECLARE v_id_estado INT;

            -- Buscar el ID del tipo de cita
            SELECT id_tipo INTO v_id_tipo_cita
            FROM TipoCita
            WHERE nombre_tipo = p_tipo_cita_nombre
            LIMIT 1;

            -- Buscar el ID de la especialidad
            SELECT id_especialidad INTO v_id_especialidad
            FROM Especialidad
            WHERE nombre_especialidad = p_especialidad_nombre
            LIMIT 1;

            -- Buscar el ID del estado
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;

            UPDATE Cita
            SET id_paciente = p_numero_paciente,
                id_doctor = p_id_doctor,
                asignador = p_asignador,
                solicitante = p_solicitante,
                tipo_solicitante = p_tipo_solicitante,
                fecha = p_fecha,
                hora = p_hora,
                tipo_cita = v_id_tipo_cita,
                costo = p_costo,
                especialidad = v_id_especialidad,
                requiere_autorizacion = p_requiere_autorizacion,
                documento_autorizacion = p_documento_autorizacion,
                estado = v_id_estado
            WHERE id_cita = p_id_cita;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteCita(
            IN p_id_cita INT
        )
        BEGIN
            DELETE FROM Cita
            WHERE id_cita = p_id_cita;
        END$$
        DELIMITER ;

    -- ?Actualizar estado
        DELIMITER $$
        CREATE PROCEDURE sp_updateEstadoCita(
            IN p_id_cita INT,              -- ID de la cita
            IN p_estado_nombre VARCHAR(50) -- Nuevo nombre del estado
        )
        BEGIN
            DECLARE v_id_estado INT;

            -- Buscar el ID del estado usando el nombre del estado
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;

            -- Verificar si se encontró el estado
            IF v_id_estado IS NOT NULL THEN
                -- Actualizar el estado de la cita
                UPDATE Cita
                SET estado = v_id_estado
                WHERE id_cita = p_id_cita;
            ELSE
                -- Si el estado no existe, lanzar un error
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'El estado especificado no existe.';
            END IF;
        END$$
        DELIMITER ;



    -- ?Calls
    -- CALL sp_insertCita(1012345424, 3, 'paciente', NULL, 1012345424, '2024-12-15', '09:00:00', 'Especialista', 100.00, 'Cardiología', FALSE, NULL); -- *Funcional
    -- CALL sp_selectCita(1); -- *Funcional
    -- CALL sp_updateCita(1, 1012345424, 3, 'paciente', 4, 1012345424, '2024-12-16', '10:00:00', 'Consulta Especial', 150.00, 'Dermatología', TRUE, 'ruta_doc_autorizacion.pdf', 'Confirmada'); -- *Funcional
    -- CALL sp_deleteCita(1); -- *Funcional
    -- CALL sp_updateEstadoCita(1, 'Confirmada'); -- *Funcional






    -- !--------------------------------------------------------------------------------------

-- !AUTORIZACION PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertAutorizacion(
            IN p_id_paciente INT,
            IN p_id_doctor INT,
            IN p_asignador INT,
            IN p_tipo_cita_nombre VARCHAR(50),  
            IN p_fecha_procedimiento DATE,
            IN p_descripcion TEXT,
            IN p_firma_doctor VARCHAR(255)
        )
        BEGIN
            DECLARE v_id_tipo_cita INT;
            
            -- Buscar el ID del tipo de cita usando el nombre
            SELECT id_tipo INTO v_id_tipo_cita
            FROM TipoCita
            WHERE nombre_tipo = p_tipo_cita_nombre
            LIMIT 1;
            
            INSERT INTO Autorizacion (id_paciente, id_doctor, asignador, tipo_cita, fecha_procedimiento, descripcion, firma_doctor, estado)
            VALUES (p_id_paciente, p_id_doctor, p_asignador, v_id_tipo_cita, p_fecha_procedimiento, p_descripcion, p_firma_doctor, 1);
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectAutorizacion(
            IN p_id_autorizacion INT
        )
        BEGIN
            SELECT 
                Autorizacion.id_autorizacion,
                Paciente.nombre AS paciente_nombre,
                Doctor.nombre AS doctor_nombre,
                Administrativos.nombre AS asignador_nombre,
                TipoCita.nombre_tipo AS tipo_cita,
                Autorizacion.fecha_resolucion,
                Autorizacion.fecha_procedimiento,
                Autorizacion.descripcion,
                Autorizacion.firma_doctor,
                Estado.nombre_estado AS estado,
                Autorizacion.fecha_registro
            FROM Autorizacion
            JOIN Paciente ON Autorizacion.id_paciente = Paciente.numero_documento
            JOIN Doctor ON Autorizacion.id_doctor = Doctor.id_doctor
            LEFT JOIN Administrativos ON Autorizacion.asignador = Administrativos.id_Administrativos
            JOIN TipoCita ON Autorizacion.tipo_cita = TipoCita.id_tipo
            JOIN Estado ON Autorizacion.estado = Estado.id_estado
            WHERE Autorizacion.id_autorizacion = p_id_autorizacion;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateAutorizacion(
            IN p_id_autorizacion INT,        
            IN p_id_paciente INT,
            IN p_id_doctor INT,
            IN p_asignador INT,
            IN p_tipo_cita_nombre VARCHAR(50),  
            IN p_fecha_procedimiento DATE,
            IN p_descripcion TEXT,
            IN p_firma_doctor VARCHAR(255),
            IN p_estado_nombre VARCHAR(50)    
        )
        BEGIN
            DECLARE v_id_tipo_cita INT;
            DECLARE v_id_estado INT;

            -- Buscar el ID del tipo de cita usando el nombre
            SELECT id_tipo INTO v_id_tipo_cita
            FROM TipoCita
            WHERE nombre_tipo = p_tipo_cita_nombre
            LIMIT 1;

            -- Buscar el ID del nuevo estado usando el nombre
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;

            -- Actualizar la autorización
            UPDATE Autorizacion
            SET id_paciente = p_id_paciente,
                id_doctor = p_id_doctor,
                asignador = p_asignador,
                tipo_cita = v_id_tipo_cita,
                fecha_procedimiento = p_fecha_procedimiento,
                descripcion = p_descripcion,
                firma_doctor = p_firma_doctor,
                estado = v_id_estado  -- Modificar el estado a la nueva ID
            WHERE id_autorizacion = p_id_autorizacion;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteAutorizacion(
            IN p_id_autorizacion INT
        )
        BEGIN
            DELETE FROM Autorizacion
            WHERE id_autorizacion = p_id_autorizacion;
        END$$
        DELIMITER ;


    -- ?Calls
    -- CALL sp_insertAutorizacion(1012345424, 5, 3, 'Examen', '2024-10-20', 'Autorización para procedimiento general', 'firma1.png'); -- *Funcional
    -- CALL sp_selectAutorizacion(1);  
    -- CALL sp_updateAutorizacion(1, 1012345424, 2, 3, 'Consulta General', '2024-10-25', 'Actualización de la autorización para procedimiento', 'firma_actualizada.png', 'Aprobado');
    -- CALL sp_deleteAutorizacion(1);  




    -- !--------------------------------------------------------------------------------------

-- !HISTORIAL AUTORIZACION PROCEDURE
    -- ?Insertar
        DELIMITER $$
        CREATE PROCEDURE sp_insertHistorialAutorizacion(
            IN p_id_autorizacion INT,        
            IN p_estado_nombre VARCHAR(50)   
        )
        BEGIN
            DECLARE v_id_estado INT;

            -- Buscar el ID del estado usando el nombre
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;
            
            INSERT INTO HistorialAutorizacion (id_autorizacion, id_estado, fecha_cambio)
            VALUES (p_id_autorizacion, v_id_estado, NOW());
        END$$
        DELIMITER ;

    -- ?Consultar
        DELIMITER $$
        CREATE PROCEDURE sp_selectHistorialAutorizacion(
            IN p_id_autorizacion INT          
        )
        BEGIN
            SELECT 
                HistorialAutorizacion.id_historial,
                HistorialAutorizacion.fecha_cambio,
                Estado.nombre_estado AS estado
            FROM HistorialAutorizacion
            JOIN Estado ON HistorialAutorizacion.id_estado = Estado.id_estado
            WHERE HistorialAutorizacion.id_autorizacion = p_id_autorizacion;
        END$$
        DELIMITER ;

    -- ?Actualizar
        DELIMITER $$
        CREATE PROCEDURE sp_updateHistorialAutorizacion(
            IN p_id_historial INT,            
            IN p_estado_nombre VARCHAR(50)    
        )
        BEGIN
            DECLARE v_id_estado INT;

            -- Buscar el ID del estado usando el nombre
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;

            UPDATE HistorialAutorizacion
            SET id_estado = v_id_estado,
                fecha_cambio = NOW()  
            WHERE id_historial = p_id_historial;
        END$$
        DELIMITER ;

    -- ?Borrar
        DELIMITER $$
        CREATE PROCEDURE sp_deleteHistorialAutorizacion(
            IN p_id_historial INT              
        )
        BEGIN
            DELETE FROM HistorialAutorizacion
            WHERE id_historial = p_id_historial;
        END$$
        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertHistorialAutorizacion(6, 'Aprobado');
    -- CALL sp_selectHistorialAutorizacion(6);  
    -- CALL sp_updateHistorialAutorizacion(6, 'Rechazado');
    -- CALL sp_deleteHistorialAutorizacion(6);  

    -- !--------------------------------------------------------------------------------------

-- !HISTORIAL CITA PROCEDURE
    DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertHistorialCita(
            IN p_id_cita INT,        
            IN p_estado_nombre VARCHAR(50)   
        )
        BEGIN
            DECLARE v_id_estado INT;

            -- Buscar el ID del estado usando el nombre
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;
            
            INSERT INTO HistorialCita (id_cita, id_estado, fecha_cambio)
            VALUES (p_id_cita, v_id_estado, NOW());
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectHistorialCita(
            IN p_id_cita INT          
        )
        BEGIN
            SELECT 
                HistorialCita.id_historial,
                HistorialCita.fecha_cambio,
                Estado.nombre_estado AS estado
            FROM HistorialCita
            JOIN Estado ON HistorialCita.id_estado = Estado.id_estado
            WHERE HistorialCita.id_cita = p_id_cita;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updateHistorialCita(
            IN p_id_historial INT,            
            IN p_estado_nombre VARCHAR(50)    
        )
        BEGIN
            DECLARE v_id_estado INT;

            -- Buscar el ID del estado usando el nombre
            SELECT id_estado INTO v_id_estado
            FROM Estado
            WHERE nombre_estado = p_estado_nombre
            LIMIT 1;

            UPDATE HistorialCita
            SET id_estado = v_id_estado,
                fecha_cambio = NOW()  
            WHERE id_historial = p_id_historial;
        END$$

    -- ?Borrar
        CREATE PROCEDURE sp_deleteHistorialCita(
            IN p_id_historial INT              
        )
        BEGIN
            DELETE FROM HistorialCita
            WHERE id_historial = p_id_historial;
        END$$   

    DELIMITER ;


    -- ?Calls
    -- CALL sp_insertHistorialCita(1, 'Confirmada');
    -- CALL sp_selectHistorialCita(1);
    -- CALL sp_updateHistorialCita(1, 'Cancelada');
    -- CALL sp_deleteHistorialCita(1);


    -- !--------------------------------------------------------------------------------------

-- !HISTORIAL CLINICO PROCEDURE
        DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertHistorialClinico(
            IN p_id_paciente INT,
            IN p_diagnostico TEXT,
            IN p_tratamiento TEXT,
            IN p_procedimientos TEXT,
            IN p_observaciones TEXT,
            IN p_alergias TEXT
        )
        BEGIN
            INSERT INTO HistorialClinico (id_paciente, diagnostico, tratamiento, procedimientos, observaciones, alergias)
            VALUES (p_id_paciente, p_diagnostico, p_tratamiento, p_procedimientos, p_observaciones, p_alergias);
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectHistorialClinico(
            IN p_id_paciente INT          
        )
        BEGIN
            SELECT 
                id_historial_clinico,
                fecha_registro,
                diagnostico,
                tratamiento,
                procedimientos,
                observaciones,
                alergias
            FROM HistorialClinico
            WHERE id_paciente = p_id_paciente;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updateHistorialClinico(
            IN p_id_historial_clinico INT,
            IN p_diagnostico TEXT,
            IN p_tratamiento TEXT,
            IN p_procedimientos TEXT,
            IN p_observaciones TEXT,
            IN p_alergias TEXT
        )
        BEGIN
            UPDATE HistorialClinico
            SET diagnostico = p_diagnostico,
                tratamiento = p_tratamiento,
                procedimientos = p_procedimientos,
                observaciones = p_observaciones,
                alergias = p_alergias
            WHERE id_historial_clinico = p_id_historial_clinico;
        END$$

    -- ?Borrar
        CREATE PROCEDURE sp_deleteHistorialClinico(
            IN p_id_historial_clinico INT              
        )
        BEGIN
            DELETE FROM HistorialClinico
            WHERE id_historial_clinico = p_id_historial_clinico;
        END$$

        DELIMITER ;

    -- ?Calls
    -- CALL sp_insertHistorialClinico(1012345424, 'Infección', 'Antibióticos', 'Ninguno', 'Observaciones sobre el paciente', 'Sin alergias');
    -- CALL sp_selectHistorialClinico(1012345424);
    -- CALL sp_updateHistorialClinico(1, 'Infección mejorada', 'Continuar con antibióticos', 'Ninguno', 'Observaciones actualizadas', 'Sin alergias');
    -- CALL sp_deleteHistorialClinico(1);

    -- !--------------------------------------------------------------------------------------

-- !HISTOPRIAL CLINICO CITA PROCEDURE
    DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertHistorialClinicoCita(
            IN p_id_historial INT,
            IN p_id_cita INT
        )
        BEGIN
            INSERT INTO HistorialClinico_Cita (id_historial, id_cita)
            VALUES (p_id_historial, p_id_cita);
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectHistorialClinicoCita(
            IN p_id_historial INT          
        )
        BEGIN
            SELECT 
                HistorialClinico_Cita.id_historial,
                HistorialClinico_Cita.id_cita,
                HistorialClinico_Cita.fecha_actualizacion
            FROM HistorialClinico_Cita
            WHERE HistorialClinico_Cita.id_historial = p_id_historial;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updateHistorialClinicoCita(
            IN p_id_historial INT,
            IN p_id_cita INT
        )
        BEGIN
            UPDATE HistorialClinico_Cita
            SET fecha_actualizacion = NOW()
            WHERE id_historial = p_id_historial AND id_cita = p_id_cita;
        END$$

    -- ?Borrar
        CREATE PROCEDURE sp_deleteHistorialClinicoCita(
            IN p_id_historial INT,
            IN p_id_cita INT              
        )
        BEGIN
            DELETE FROM HistorialClinico_Cita
            WHERE id_historial = p_id_historial AND id_cita = p_id_cita;
        END$$

        DELIMITER ;


    -- ?Calls
    -- CALL sp_insertHistorialClinicoCita(1, 1);
    -- CALL sp_selectHistorialClinicoCita(1);
    -- CALL sp_updateHistorialClinicoCita(1, 1);
    -- CALL sp_deleteHistorialClinicoCita(1, 1);


    -- !--------------------------------------------------------------------------------------

-- !PUBLICACION PROCEDURE
    DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertPublicacion(
            IN p_imagen_publicacion VARCHAR(255),
            IN p_titulo VARCHAR(100),
            IN p_contenido TEXT,
            IN p_fecha_publicacion DATETIME
        )
        BEGIN
            INSERT INTO Publicacion (imagen_publicacion, titulo, contenido, fecha_publicacion)
            VALUES (p_imagen_publicacion, p_titulo, p_contenido, p_fecha_publicacion);
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectPublicacion(
            IN p_id_publicacion INT          
        )
        BEGIN
            SELECT 
                id_publicacion,
                imagen_publicacion,
                titulo,
                contenido,
                fecha_publicacion
            FROM Publicacion
            WHERE id_publicacion = p_id_publicacion;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updatePublicacion(
            IN p_id_publicacion INT,
            IN p_imagen_publicacion VARCHAR(255),
            IN p_titulo VARCHAR(100),
            IN p_contenido TEXT,
            IN p_fecha_publicacion DATETIME
        )
        BEGIN
            UPDATE Publicacion
            SET imagen_publicacion = p_imagen_publicacion,
                titulo = p_titulo,
                contenido = p_contenido,
                fecha_publicacion = p_fecha_publicacion
            WHERE id_publicacion = p_id_publicacion;
        END$$

    -- ?Borrar
        CREATE PROCEDURE sp_deletePublicacion(
            IN p_id_publicacion INT              
        )
        BEGIN
            DELETE FROM Publicacion
            WHERE id_publicacion = p_id_publicacion;
        END$$

    DELIMITER ;


    -- ?Calls
    -- CALL sp_insertPublicacion('imagen1.jpg', 'Título de la publicación', 'Contenido de la publicación', NOW());
    -- CALL sp_selectPublicacion(1);  -- Cambia el 1 por el ID de publicación que desees consultar
    -- CALL sp_updatePublicacion(1, 'imagen_actualizada.jpg', 'Título actualizado', 'Contenido actualizado', NOW());
    -- CALL sp_deletePublicacion(1);  -- Cambia el 1 por el ID de publicación que desees eliminar



    -- !--------------------------------------------------------------------------------------

-- !ADMINISTRATIVO PUBLICACION PROCEDURE
    DELIMITER $$

        -- ?Insertar
            CREATE PROCEDURE sp_insertAdministrativosPublicacion(
                IN p_id_Administrativos INT,
                IN p_id_publicacion INT
            )
            BEGIN
                INSERT INTO Administrativos_Publicacion (id_Administrativos, id_publicacion)
                VALUES (p_id_Administrativos, p_id_publicacion);
            END$$

        -- ?Consultar
            CREATE PROCEDURE sp_selectAdministrativosPublicacion(
                IN p_id_Administrativos INT          
            )
            BEGIN
                SELECT 
                    Administrativos_Publicacion.id_Administrativos,
                    Administrativos_Publicacion.id_publicacion,
                    Publicacion.titulo AS titulo_publicacion
                FROM Administrativos_Publicacion
                JOIN Publicacion ON Administrativos_Publicacion.id_publicacion = Publicacion.id_publicacion
                WHERE Administrativos_Publicacion.id_Administrativos = p_id_Administrativos;
            END$$

        -- ?Actualizar (No es buena practica)
            CREATE PROCEDURE sp_updateAdministrativosPublicacion(
                IN p_id_Administrativos INT,
                IN p_id_publicacion INT
            )
            BEGIN
                DELETE FROM Administrativos_Publicacion
                WHERE id_Administrativos = p_id_Administrativos;

                INSERT INTO Administrativos_Publicacion (id_Administrativos, id_publicacion)
                VALUES (p_id_Administrativos, p_id_publicacion);
            END$$

        -- ?Borrar
            CREATE PROCEDURE sp_deleteAdministrativosPublicacion(
                IN p_id_Administrativos INT,
                IN p_id_publicacion INT              
            )
            BEGIN
                DELETE FROM Administrativos_Publicacion
                WHERE id_Administrativos = p_id_Administrativos AND id_publicacion = p_id_publicacion;
            END$$

    DELIMITER ;


    -- ?Calls
    -- CALL sp_insertAdministrativosPublicacion(1, 1);
    -- CALL sp_selectAdministrativosPublicacion(1);  
    -- CALL sp_updateAdministrativosPublicacion(1, 2);  
    -- CALL sp_deleteAdministrativosPublicacion(1, 1);  

    -- !--------------------------------------------------------------------------------------

-- !SECRETARIA PUBLICACION PROCEDURE
    DELIMITER $$

        -- ?Insertar
            CREATE PROCEDURE sp_insertSecretariaPublicacion(
                IN p_id_Secretaria INT,
                IN p_id_publicacion INT
            )
            BEGIN
                INSERT INTO Secretaria_Publicacion (id_Secretaria, id_publicacion)
                VALUES (p_id_Secretaria, p_id_publicacion);
            END$$

        -- ?Consultar
            CREATE PROCEDURE sp_selectSecretariaPublicacion(
                IN p_id_Secretaria INT          
            )
            BEGIN
                SELECT 
                    Secretaria_Publicacion.id_Secretaria,
                    Secretaria_Publicacion.id_publicacion,
                    Publicacion.titulo AS titulo_publicacion
                FROM Secretaria_Publicacion
                JOIN Publicacion ON Secretaria_Publicacion.id_publicacion = Publicacion.id_publicacion
                WHERE Secretaria_Publicacion.id_Secretaria = p_id_Secretaria;
            END$$

        -- ?Actualizar (No es buena practica)
            CREATE PROCEDURE sp_updateSecretariaPublicacion(
                IN p_id_Secretaria INT,
                IN p_id_publicacion INT
            )
            BEGIN
                DELETE FROM Secretaria_Publicacion
                WHERE id_Secretaria = p_id_Secretaria;

                INSERT INTO Secretaria_Publicacion (id_Secretaria, id_publicacion)
                VALUES (p_id_Secretaria, p_id_publicacion);
            END$$

        -- ?Borrar
            CREATE PROCEDURE sp_deleteSecretariaPublicacion(
                IN p_id_Secretaria INT,
                IN p_id_publicacion INT              
            )
            BEGIN
                DELETE FROM Secretaria_Publicacion
                WHERE id_Secretaria = p_id_Secretaria AND id_publicacion = p_id_publicacion;
            END$$

    DELIMITER ;


    -- ?Calls
    -- CALL sp_insertSecretariaPublicacion(1, 1);
    -- CALL sp_selectSecretariaPublicacion(1);  
    -- CALL sp_updateSecretariaPublicacion(1, 2);  
    -- CALL sp_deleteSecretariaPublicacion(1, 1); 


    -- !--------------------------------------------------------------------------------------

-- !FACTURA PROCEDURE
    DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertFactura(
            IN p_id_servicio INT,
            IN p_tipo_servicio ENUM('Cita', 'Afiliacion'),
            IN p_paciente INT,
            IN p_fecha_limite DATETIME,
            IN p_monto_total DECIMAL(10,2),
            IN p_estado_pago ENUM('Pendiente', 'Pagado'),
            IN p_descripcion TEXT
        )
        BEGIN
            INSERT INTO Factura (id_servicio, tipo_servicio, paciente, fecha_limite, monto_total, estado_pago, descripcion)
            VALUES (p_id_servicio, p_tipo_servicio, p_paciente, p_fecha_limite, p_monto_total, p_estado_pago, p_descripcion);
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectFactura(
            IN p_id_factura INT          
        )
        BEGIN
            SELECT 
                id_factura,
                id_servicio,
                tipo_servicio,
                paciente,
                fecha_emision,
                fecha_limite,
                monto_total,
                estado_pago,
                descripcion
            FROM Factura
            WHERE id_factura = p_id_factura;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updateFactura(
            IN p_id_factura INT,
            IN p_id_servicio INT,
            IN p_tipo_servicio ENUM('Cita', 'Afiliacion'),
            IN p_paciente INT,
            IN p_fecha_limite DATETIME,
            IN p_monto_total DECIMAL(10,2),
            IN p_estado_pago ENUM('Pendiente', 'Pagado'),
            IN p_descripcion TEXT
        )
        BEGIN
            UPDATE Factura
            SET id_servicio = p_id_servicio,
                tipo_servicio = p_tipo_servicio,
                paciente = p_paciente,
                fecha_limite = p_fecha_limite,
                monto_total = p_monto_total,
                estado_pago = p_estado_pago,
                descripcion = p_descripcion
            WHERE id_factura = p_id_factura;
        END$$

    -- ?Borrar
        CREATE PROCEDURE sp_deleteFactura(
            IN p_id_factura INT              
        )
        BEGIN
            DELETE FROM Factura
            WHERE id_factura = p_id_factura;
        END$$

    DELIMITER ;

    -- ?Calls
    -- CALL sp_insertFactura(1, 'Cita', 1012345424, '2024-10-30', 100.00, 'Pendiente', 'Factura por consulta médica');
    -- CALL sp_selectFactura(1);  -- Cambia el 1 por el ID de la factura que desees consultar
    -- CALL sp_updateFactura(1, 2, 'Afiliacion', 1012345424, '2024-11-30', 120.00, 'Pendiente', 'Actualización de la factura');
    -- CALL sp_deleteFactura(1);  -- Cambia el 1 por el ID de la factura que desees eliminar

    -- !--------------------------------------------------------------------------------------

-- !PAGO PROCEDURE
    DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertPago(
            IN p_id_factura INT,
            IN p_monto DECIMAL(10,2),
            IN p_metodo_pago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'Cheque')
        )
        BEGIN
            INSERT INTO Pago (id_factura, monto, metodo_pago)
            VALUES (p_id_factura, p_monto, p_metodo_pago);
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectPago(
            IN p_id_pago INT          
        )
        BEGIN
            SELECT 
                id_pago,
                id_factura,
                fecha_pago,
                monto,
                metodo_pago
            FROM Pago
            WHERE id_pago = p_id_pago;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updatePago(
            IN p_id_pago INT,
            IN p_id_factura INT,
            IN p_monto DECIMAL(10,2),
            IN p_metodo_pago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'Cheque')
        )
        BEGIN
            UPDATE Pago
            SET id_factura = p_id_factura,
                monto = p_monto,
                metodo_pago = p_metodo_pago
            WHERE id_pago = p_id_pago;
        END$$

    -- ?Borrar
        CREATE PROCEDURE sp_deletePago(
            IN p_id_pago INT              
        )
        BEGIN
            DELETE FROM Pago
            WHERE id_pago = p_id_pago;
        END$$

    DELIMITER ;


    -- ?Calls
    -- CALL sp_insertPago(1, 100.00, 'Efectivo');
    -- CALL sp_selectPago(1);  
    -- CALL sp_updatePago(1, 2, 120.00, 'Tarjeta de Crédito');  
    --CALL sp_deletePago(1);  


    -- !--------------------------------------------------------------------------------------

-- !OBSERVACION PROCEDURE
    DELIMITER $$

    -- ?Insertar
        CREATE PROCEDURE sp_insertObservacion(
            IN p_id_cita INT,
            IN p_observacion TEXT
        )
        BEGIN
            INSERT INTO Observacion (id_cita, observacion)
            VALUES (p_id_cita, p_observacion);
        END$$

    -- ?Consultar
        CREATE PROCEDURE sp_selectObservacion(
            IN p_id_observacion INT          
        )
        BEGIN
            SELECT 
                id_observacion,
                id_cita,
                observacion,
                fecha_observacion
            FROM Observacion
            WHERE id_observacion = p_id_observacion;
        END$$

    -- ?Actualizar
        CREATE PROCEDURE sp_updateObservacion(
            IN p_id_observacion INT,
            IN p_id_cita INT,
            IN p_observacion TEXT
        )
        BEGIN
            UPDATE Observacion
            SET id_cita = p_id_cita,
                observacion = p_observacion
            WHERE id_observacion = p_id_observacion;
        END$$

        -- ?Borrar
        CREATE PROCEDURE sp_deleteObservacion(
            IN p_id_observacion INT              
        )
        BEGIN
            DELETE FROM Observacion
            WHERE id_observacion = p_id_observacion;
        END$$

    DELIMITER ;


    -- ?Calls
    -- CALL sp_insertObservacion(1, 'Observación del paciente durante la consulta.');
    -- CALL sp_selectObservacion(1);  
    -- CALL sp_updateObservacion(1, 2, 'Observación actualizada para la cita.'); 
    -- CALL sp_deleteObservacion(1);  



    -- !--------------------------------------------------------------------------------------


-- Consultas utiles 
-- SHOW PROCEDURE STATUS WHERE Db = 'Health_connection';
-- mysql -u Admin -p Health_connection < backup_schema.sql
-- mysql -u Admin -p Health_connection < backup_data.sql
