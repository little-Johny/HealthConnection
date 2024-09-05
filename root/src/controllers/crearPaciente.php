<?php
include_once '../../config/app.php';
try {
    include_once DB_CONNECTION_PATH;

    // Recoger los datos del formulario
    $numero_documento = $_POST['numero_documento'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $tipo_doc = $_POST['tipo_doc'];
    $fecha_de_nacimiento = $_POST['fecha_de_nacimiento'];
    $genero = $_POST["genero"];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $direccion = $_POST['direccion'] ?? null;
    $id_ciudad = $_POST['ciudad'] ?? null;
    $contraseña = $_POST['contraseña'];
    $id_afiliacion = $_POST['id_afiliacion'] ?? null;
    $fotoPerfil = null;

    if ($id_ciudad === null) {
        throw new Exception("El ID de la ciudad no está definido.");
    }

    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = $_FILES['foto_perfil']['name'];
        $rutaTemporal = $_FILES['foto_perfil']['tmp_name'];
        $directorioDestino = '../../public/uploads/patients';
        $rutaArchivo = $directorioDestino . uniqid() . '_' . $nombreArchivo;

        if (move_uploaded_file($rutaTemporal, $rutaArchivo)) {
            $fotoPerfil = $rutaArchivo;
        } else {
            throw new Exception("Error al subir la imagen de perfil.");
        }
    }

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

    $sentencia = $database->prepare("INSERT INTO Paciente(numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_afiliacion, foto_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
    $result = $sentencia->execute([$numero_documento, $nombre, $apellido, $tipo_doc, $fecha_de_nacimiento, $genero, $telefono, $email, $id_direccion, $contraseña, $id_afiliacion, $fotoPerfil]);

    if ($result === TRUE) {
        echo "<script>
                alert('Registrado exitosamente');
                window.location.href = '/HealthConnection/root/public/index.php';
            </script>";
    } else {
        echo "Algo salió mal.";
    }

} catch (PDOException $error) {
    echo "Error: " . $error->getMessage();
} catch (Exception $error) {
    echo "Error: " . $error->getMessage();
}
