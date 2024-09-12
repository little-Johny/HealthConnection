<?php 
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

if($_SERVER["REQUEST_METHOD"]=== "POST"){
    $id_Secretaria=$_POST["id_Secretaria"];
    $nombre = $_POST['nombre'];
    $apellido =$_POST['apellido'] ;
    $tipo_doc =$_POST['tipo_doc'] ;
    $numero_documento =$_POST['numero_documento'];
    $email =$_POST['email'];
    $telefono =$_POST['telefono'];
    $direccion =$_POST['direccion'];
    $id_ciudad =$_POST['ciudad'];

    if($id_ciudad === null){
        throw new Exception("El ID de la ciudad no esta definido.");
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
        UPDATE Secretaria
        SET nombre = ?, apellido = ?, tipo_documento = ?, numero_documento = ?, telefono = ?, email=?, direccion = ?
        WHERE id_Secretaria = ?;
    ");

    // Ejecutar la sentencia de actualización
    $resultado = $sentencia->execute([$nombre, $apellido, $tipo_doc, $numero_documento, $telefono, $email, $id_direccion, $id_Secretaria]);

    if ($resultado) {
        header("Location:../../views/admin/verRegistros.php");
    } else {
        echo "Error al actualizar la información del paciente.";
    }
}