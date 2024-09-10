<?php 

require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';


try{
    $sentencia =$database->prepare("SELECT a. id_Administrativos, a. nombre, a. apellido, a. tipo_documento, a. numero_documento, a. telefono, a. email, a. direccion, d. direccion, d. id_ciudad, c. nombre_ciudad FROM Administrativos a
    JOIN Direccion d ON a. direccion = d. id_direccion 
    JOIN Ciudad c ON d. id_ciudad = c. id_ciudad;");

    $sentencia->execute();
    $administrativos = $sentencia->fetchAll(PDO::FETCH_OBJ);
}catch(PDOException $error){
    echo "Error de base de datos: " . $error->getMessage();
}