<?php
require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $numero_documento = $_POST['numero_documento'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'] ?? null;
    $direccion = $_POST['direccion'] ?? null;
    $id_ciudad = $_POST['ciudad'] ?? null; 
    $id_afiliacion = $_POST['id_afiliacion'] ?? null;
    $fotoPerfil = null;

    if ($id_ciudad === null) {
        throw new Exception("El ID de la ciudad no está definido.");
    }

    // Verificar si se subió una imagen de perfil
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        // Procesar la imagen
        $nombreArchivo = $_FILES['foto_perfil']['name'];
        $rutaTemporal = $_FILES['foto_perfil']['tmp_name'];
        $directorioDestino = '../../uploads/pacientes/';
        $rutaArchivo = $directorioDestino . uniqid() . '_' . $nombreArchivo;

        // Mover el archivo a la carpeta de destino
        if (move_uploaded_file($rutaTemporal, $rutaArchivo)) {
            $fotoPerfil = $rutaArchivo; // Guardamos la ruta de la imagen
        } else {
            throw new Exception("Error al subir la imagen de perfil.");
        }
    }

    // Verificar que la dirección exista y si no, insertar su nuevo registro y obtener su ID
    if ($direccion !== null) {
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
    } else {
        throw new Exception("La dirección no está definida.");
    }

    // Preparar la sentencia de actualización
    $sentencia = $database->prepare("
        UPDATE Paciente
        SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, id_plan_afiliacion = ?, foto_perfil = ?
        WHERE numero_documento = ?
    ");

    // Ejecutar la sentencia de actualización
    $resultado = $sentencia->execute([$nombre, $apellido, $email, $telefono, $id_direccion, $id_afiliacion, $fotoPerfil, $numero_documento]);

    if ($resultado) {
        header("Location:../../views/admin/verRegistros.php");
    } else {
        echo "Error al actualizar la información del paciente.";
    }
}
