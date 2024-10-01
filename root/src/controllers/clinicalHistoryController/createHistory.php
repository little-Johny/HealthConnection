<?php

require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

try {
    

    // Asignar variables POST
    $id_paciente=$_POST["id_paciente"];
    $diagnostico = $_POST["diagnostico"];
    $tratamiento = $_POST["tratamiento"];
    $procedimientos = $_POST["procedimientos"];
    $observaciones = $_POST["observaciones"];
    $alergias = $_POST["alergias"];

    // Insertar en HistorialClinico
    $sentenciaHistory = $database->prepare("
        INSERT INTO HistorialClinico (id_paciente, diagnostico, tratamiento, procedimientos, observaciones, alergias) 
        VALUES (?, ?, ?, ?, ?, ?);
    ");

    $result = $sentenciaHistory->execute([$id_paciente, $diagnostico, $tratamiento, $procedimientos, $observaciones, $alergias]);

    if ($result === TRUE) {
        echo "<script>
                alert('Historial clínico registrado exitosamente');
                window.location.href = '../../views/admin/verRegistros.php';
            </script>";
    } else {
        echo "<script>
                alert('Error al registrar el historial clínico');
            </script>";
    }

} catch (PDOException $error) {
    echo "Error de base de datos: " . $error->getMessage();
} catch (Exception $error) {
    echo "Error: " . $error->getMessage();
}
