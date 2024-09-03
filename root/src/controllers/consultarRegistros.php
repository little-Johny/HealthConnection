<?php
include_once "../../../config/databaseConexion.php";
$sentencia= $database->query("SELECT * FROM Paciente;");
$paciente= $sentencia->fetchAll(PDO::FETCH_OBJ);