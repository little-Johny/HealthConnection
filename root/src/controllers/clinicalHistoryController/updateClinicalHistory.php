<?php
require_once '../../../config/databaseConexion.php'; // Conexión a la base de datos

// Verifica si el formulario fue enviado correctamente
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtiene los valores del formulario
    $id_historial_clinico = $_POST['id_historial_clinico'];
    $id_paciente = $_POST['id_paciente'];
    $fecha_registro = $_POST['fecha_registro'];
    $diagnostico = $_POST['diagnostico'];
    $tratamiento = $_POST['tratamiento'];
    $procedimientos = $_POST['procedimientos'];
    $observaciones = $_POST['observaciones'];
    $alergias = $_POST['alergias'];
    
    // Preparar la consulta para actualizar los datos en la base de datos
    $sql = "UPDATE HistorialClinico SET fecha_registro = :fecha_registro, diagnostico = :diagnostico, tratamiento = :tratamiento, procedimientos = :procedimientos, observaciones = :observaciones, alergias = :alergias WHERE id_historial_clinico = :id_historial_clinico AND id_paciente = :id_paciente";
    $stmt = $database->prepare($sql);

    // Ejecutar la consulta con los valores obtenidos del formulario
    $stmt->execute([
        ':fecha_registro' => $fecha_registro,
        ':diagnostico' => $diagnostico,
        ':tratamiento' => $tratamiento,
        ':procedimientos' => $procedimientos,
        ':observaciones' => $observaciones,
        ':alergias' => $alergias,
        ':id_historial_clinico' => $id_historial_clinico,
        ':id_paciente' => $id_paciente
    ]);


    if ($stmt) {
        header("Location: ../../views/admin/verRegistros.php");
    
    } else {
        echo "Error al actualizar la cita.";
    }

} else {
    echo "Método de solicitud no válido.";
    exit;
}

