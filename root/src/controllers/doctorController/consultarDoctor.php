<?php 
// Conexión a la base de datos
require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

try{
    $sentencia=$database->prepare("SELECT d. id_doctor, d. nombre, d. apellido, d. telefono, d. id_especialidad, d. genero, e. nombre_especialidad FROM Doctor d 
    LEFT JOIN Especialidad e ON d. id_especialidad = e. id_especialidad ");

    $sentencia->execute();
    $doctores = $sentencia->fetchAll(PDO::FETCH_OBJ);
} catch (PDOException $error) {
    echo "Error de base de datos: " . $error->getMessage();
}