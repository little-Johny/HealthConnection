<?php
include_once __DIR__ . '/../../config/app.php';

try {
    include_once DB_CONNECTION_PATH;
    $sentencia = $database->query("
        SELECT C.id_cita, P.nombre AS paciente, E.nombre_especialidad AS especialidad, C.fecha, C.hora
        FROM Cita C
        JOIN Paciente P ON C.id_paciente = P.numero_documento
        JOIN Especialidad E ON C.especialidad = E.id_especialidad
    ");
    $citas = $sentencia->fetchAll(PDO::FETCH_OBJ);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
