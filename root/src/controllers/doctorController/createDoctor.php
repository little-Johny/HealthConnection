<?php

// Conexión a la base de datos
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

try{

    
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
    $apellido = isset($_POST['apellido']) ? $_POST['apellido'] : null;
    $tipo_doc = isset($_POST['tipo_doc']) ? $_POST['tipo_doc'] : null;
    $numero_documento = isset($_POST['numero_documento']) ? $_POST['numero_documento'] : null;
    $telefono = isset($_POST['telefono']) ? $_POST['telefono'] : null;
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $direccion = isset($_POST['direccion']) ? $_POST['direccion'] : null;
    $id_ciudad = isset($_POST['ciudad']) ? $_POST['ciudad'] : null;
    $especialidad =isset($_POST['especialidad']) ? $_POST['especialidad']: null;
    $contraseña = isset($_POST['contraseña']) ? $_POST['contraseña'] : null;
    $fotoPerfil = null;
    $genero = isset($_POST['genero']) ? $_POST['genero'] : null;
    $id_rol = 2; // Rol doctor =2 

    // Encriptar la contraseña antes de guardar
    $hashedPassword = password_hash($contraseña, PASSWORD_DEFAULT);

    // Subida de la imagen de perfil con validación
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = $_FILES['foto_perfil']['name'];
        $tipoArchivo = mime_content_type($_FILES['foto_perfil']['tmp_name']);
        $tamañoArchivo = $_FILES['foto_perfil']['size'];

        // Verificar que sea una imagen y su tamaño
        if (($tipoArchivo === 'image/jpeg' || $tipoArchivo === 'image/png') && $tamañoArchivo < 5000000) { // 5MB máximo
            $rutaTemporal = $_FILES['foto_perfil']['tmp_name'];
            $directorioDestino = '../../../public/uploads/doctor/';
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


    // Insertar los datos del paciente
    $sentenciaInsertarDoctor = $database->prepare("INSERT INTO Doctor( nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion,id_especialidad, contraseña, foto_perfil, genero, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
    $result = $sentenciaInsertarDoctor->execute([ $nombre, $apellido, $tipo_doc, $numero_documento, $telefono, $email, $id_direccion, $especialidad, $hashedPassword, $fotoPerfil, $genero, $id_rol]);

    // Comprobación del resultado e impresión de mensaje
    if ($result === TRUE) {
        echo "<script>
                alert('Registrado exitosamente');
                window.location.href = '../../views/admin/verRegistros.php';
            </script>";
    } else {
        echo "Algo salió mal.";
    }



}catch (PDOException $error) {
    echo "Error de base de datos: " . $error->getMessage();
} catch (Exception $error) {
    echo "Error: " . $error->getMessage();
}