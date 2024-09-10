<?php 

require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';


try{
    $sentencia =$database->prepare("SELECT s. id_Secretaria, s. nombre, s. apellido, s. tipo_documento, s. numero_documento, s. telefono, s. email, s. direccion, d. direccion, d. id_ciudad, c. nombre_ciudad FROM Secretaria s
    JOIN Direccion d ON s. direccion = d. id_direccion 
    JOIN Ciudad c ON d. id_ciudad = c. id_ciudad;");

    $sentencia->execute();
    $secretarias = $sentencia->fetchAll(PDO::FETCH_OBJ);
}catch(PDOException $error){
    echo "Error de base de datos: " . $error->getMessage();
}