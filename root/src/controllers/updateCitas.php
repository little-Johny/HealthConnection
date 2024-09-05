<?php
include_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_cita = $_POST['id_cita'];
    $especialidad = $_POST['specialty'];
    $tipo_cita = $_POST['type'];
    $fecha = $_POST['date'];
    $hora = $_POST['time'];
    $id_doctor = !empty($_POST['preferred-doctor']) ? $_POST['preferred-doctor'] : null;

    // Calcular el costo en el servidor
    $consultaEspecialidad = $database->prepare("SELECT costo FROM Especialidad WHERE id_especialidad = ?");
    $consultaEspecialidad->execute([$especialidad]);
    $costoEspecialidad = $consultaEspecialidad->fetchColumn();

    $consultaTipoCita = $database->prepare("SELECT costo_adicional FROM TipoCita WHERE id_tipo = ?");
    $consultaTipoCita->execute([$tipo_cita]);
    $costoTipoCita = $consultaTipoCita->fetchColumn();

    $costoTotal = $costoEspecialidad + $costoTipoCita;

    // Actualizar la cita en la base de datos
    $sentencia = $database->prepare("
        UPDATE Cita
        SET especialidad = ?, tipo_cita = ?, fecha = ?, hora = ?, id_doctor = ?, costo = ?
        WHERE id_cita = ?
    ");

    $resultado = $sentencia->execute([$especialidad, $tipo_cita, $fecha, $hora, $id_doctor, $costoTotal, $id_cita]);

    if ($resultado) {
        header("Location:../views/admin/verSolicitudes.php");
    
    } else {
        echo "Error al actualizar la cita.";
    }
}

