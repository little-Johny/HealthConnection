<?php 
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

try{
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] :null ;
    $apellido = isset($_POST['apellido']) ? $_POST['apellido'] :null ;
    $tipo_doc = isset($_POST['tipo_doc']) ? $_POST['tipo_doc'] :null ;
    $numero_documento = isset($_POST['numero_documento']) ? $_POST['numero_documento'] :null;
    $email = isset($_POST['email']) ? $_POST['email'] :null;
    $telefono = isset($_POST['telefono']) ? $_POST['telefono'] :null;
    $direccion = isset($_POST['direccion']) ? $_POST['direccion'] : null;
    $id_ciudad = isset($_POST['ciudad']) ? $_POST['ciudad'] : null;
    $contraseña = isset($_POST['contraseña']) ? $_POST['contraseña'] : null;
    $id_rol = 3;

    // Encriptar la contraseña antes de guardar
    $hashedPassword = password_hash($contraseña, PASSWORD_DEFAULT);
    
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

    $sentenciaInsertarAdministrative = $database->prepare("INSERT INTO Administrativos(nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);");
    $result=$sentenciaInsertarAdministrative->execute([$nombre, $apellido, $id_rol, $tipo_doc, $numero_documento, $telefono, $email, $id_direccion, $hashedPassword]); 

    // Comprobación del resultado e impresión de mensaje
    if ($result === TRUE) {
        echo "<script>
                alert('Registrado exitosamente');
                window.location.href = '../../views/admin/verRegistros.php';
            </script>";
    } else {
        echo "Algo salió mal.";
    }

}catch(PDOException $error){
    echo "Error de base de datos: " . $error->getMessage();
} catch (PDOException $error) {
    echo "Error: " . $error->getMessage();
}