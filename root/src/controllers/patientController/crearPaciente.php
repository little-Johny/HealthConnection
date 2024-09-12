<?php
try {
    // Conexión a la base de datos
    require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

    // Recoger los datos del formulario con comprobación, se usa isseta para verificar que no sean valores nullos
    $numero_documento = isset($_POST['numero_documento']) ? $_POST['numero_documento'] : null;
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
    $apellido = isset($_POST['apellido']) ? $_POST['apellido'] : null;
    $tipo_doc = isset($_POST['tipo_doc']) ? $_POST['tipo_doc'] : null;
    $fecha_de_nacimiento = isset($_POST['fecha_de_nacimiento']) ? $_POST['fecha_de_nacimiento'] : null;
    $genero = isset($_POST['genero']) ? $_POST['genero'] : null;
    $telefono = isset($_POST['telefono']) ? $_POST['telefono'] : null;
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $direccion = isset($_POST['direccion']) ? $_POST['direccion'] : null;
    $id_ciudad = isset($_POST['ciudad']) ? $_POST['ciudad'] : null;
    $contraseña = isset($_POST['contraseña']) ? $_POST['contraseña'] : null;
    $id_afiliacion = isset($_POST['id_plan_afiliacion']) ? $_POST['id_plan_afiliacion'] : null;
    $fotoPerfil = null;
    $id_rol = 1; // Rol paciente = 1
    $estado = 'inactivo'; // Estado por defecto
    $afiliado = false; // Por defecto, no afiliado

    // Subida de la imagen de perfil con validación
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = $_FILES['foto_perfil']['name'];
        $tipoArchivo = mime_content_type($_FILES['foto_perfil']['tmp_name']);
        $tamañoArchivo = $_FILES['foto_perfil']['size'];

        // Verificar que sea una imagen y su tamaño
        if (($tipoArchivo === 'image/jpeg' || $tipoArchivo === 'image/png') && $tamañoArchivo < 5000000) { // 5MB máximo
            $rutaTemporal = $_FILES['foto_perfil']['tmp_name'];
            $directorioDestino = '../../../public/uploads/patients/';
            $rutaArchivo = $directorioDestino . uniqid() . '_' . $nombreArchivo;

            if (move_uploaded_file($rutaTemporal, $rutaArchivo)) {
                $fotoPerfil = $rutaArchivo;
            } else {
                throw new Exception("Error al subir la imagen de perfil.");
            }
        } else {
            throw new Exception("Formato o tamaño de archivo no válido.");
        }
    }

    // Verificación de dirección
    $sentenciaDireccion = $database->prepare("SELECT id_direccion FROM Direccion WHERE direccion = ? AND id_ciudad = ?;");
    $sentenciaDireccion->execute([$direccion, $id_ciudad]);
    $direccionExistente = $sentenciaDireccion->fetch(PDO::FETCH_ASSOC);

    if ($direccionExistente) {
        $id_direccion = $direccionExistente['id_direccion'];
    } else {
        $sentenciaInsertarDireccion = $database->prepare("INSERT INTO Direccion(direccion, id_ciudad) VALUES(?, ?);");
        $sentenciaInsertarDireccion->execute([$direccion, $id_ciudad]);
        $id_direccion = $database->lastInsertId();
    }

    // Encriptar la contraseña antes de guardar
    $hashedPassword = password_hash($contraseña, PASSWORD_DEFAULT);

    // Insertar los datos del paciente
    $sentenciaInsertarPaciente = $database->prepare("INSERT INTO Paciente(numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_plan_afiliacion, foto_perfil, id_rol, estado, afiliado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
    $result = $sentenciaInsertarPaciente->execute([$numero_documento, $nombre, $apellido, $tipo_doc, $fecha_de_nacimiento, $genero, $telefono, $email, $id_direccion, $hashedPassword, $id_afiliacion, $fotoPerfil, $id_rol, $estado, $afiliado]);

    // Comprobación del resultado e impresión de mensaje
    if ($result === TRUE) {
        echo "<script>
                alert('Registrado exitosamente');
                window.location.href = '../../views/admin/verRegistros.php';
            </script>";
    } else {
        echo "Algo salió mal.";
    }

} catch (PDOException $error) {
    echo "Error de base de datos: " . $error->getMessage();
} catch (Exception $error) {
    echo "Error: " . $error->getMessage();
}

