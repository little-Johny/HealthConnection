<?php
try {
    include_once '../../config/databaseConexion.php';

    // Recoger los datos del formulario
    $numero_documento = $_POST['numero_documento'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $tipo_doc = $_POST['tipo_doc'];
    $fecha_de_nacimiento = $_POST['fecha_de_nacimiento'];
    $genero = $_POST["genero"];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $direccion = $_POST['direccion'] ?? null; // Dirección (texto)
    $id_ciudad = $_POST['ciudad'] ?? null; // Aquí cambiamos a `id_ciudad` en lugar de `ciudad`
    $contraseña = $_POST['contraseña'];
    $id_afiliacion = $_POST['id_afiliacion'] ?? null; // Puede ser NULL

    // Validación de que el ID de ciudad esté definido
    if ($id_ciudad === null) {
        throw new Exception("El ID de la ciudad no está definido.");
    }

    // Verificar que la dirección exista y si no insertar su nuevo registro y obtener su ID
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

    // Insertar el paciente con el ID de dirección correcto
    $sentencia = $database->prepare("INSERT INTO Paciente(numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_afiliacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
    $result = $sentencia->execute([$numero_documento, $nombre, $apellido, $tipo_doc, $fecha_de_nacimiento, $genero, $telefono, $email, $id_direccion, $contraseña, $id_afiliacion]);

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
}

