<?php
include_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

if(!isset($_POST["numero_documento"])) exit();
$numero_documento = $_POST["numero_documento"];

// Eliminar las autorizaciones relacionadas
$deleteAutorizacionesStmt = $database->prepare("DELETE FROM Autorizacion WHERE id_paciente = ?");
$deleteAutorizacionesStmt->execute([$numero_documento]);

//Eliminar Citas que esten relacionadas con el paciente
$deleteCitasStmt = $database->prepare("DELETE FROM Cita WHERE id_paciente = ?");
$deleteCitasStmt->execute([$numero_documento]);
//Eliminar Hitorial clinico que este relacionado con el paciente
$deleteCitasStmt = $database->prepare("DELETE FROM HistorialClinico WHERE id_paciente = ?");
$deleteCitasStmt->execute([$numero_documento]);
//Eliminar Facturas que esten relacionadas con el paciente
$deleteCitasStmt = $database->prepare("DELETE FROM Factura WHERE paciente = ?");
$deleteCitasStmt->execute([$numero_documento]);


// Ahora eliminar el paciente
$deletePacienteStmt = $database->prepare("DELETE FROM Paciente WHERE numero_documento = ?");
$resultado = $deletePacienteStmt->execute([$numero_documento]);

if($resultado) {
    echo '
    <script> 
        alert("El paciente ha sido eliminada correctamente.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}
else {
    echo '
    <script> 
        alert("El paciente NO pudo ser eliminada.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}