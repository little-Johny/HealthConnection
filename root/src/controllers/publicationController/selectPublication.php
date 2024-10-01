<?php

try{

    require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

    $sentencia = $database->prepare("SELECT * FROM Publicacion;");
    $sentencia->execute();
    $publicaciones = $sentencia->fetchAll(PDO::FETCH_OBJ);
    


}catch(PDOException $error){
    echo "Error de base de datos: " . $error->getMessage();
}


