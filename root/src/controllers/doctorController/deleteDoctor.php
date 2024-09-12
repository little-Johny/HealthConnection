<?php
if(!isset($_POST["id_doctor"])) exit();
$id_doctor = $_POST["id_doctor"];
include_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

// Eliminar las autorizaciones relacionadas
$deleteAutorizacionesStmt = $database->prepare("DELETE FROM Autorizacion WHERE id_doctor = ?");
$deleteAutorizacionesStmt->execute([$id_doctor]);

//Eliminar Citas que esten relacionadas con el Doctor
$deleteCitasStmt = $database->prepare("DELETE FROM Cita WHERE id_doctor = ?");
$deleteCitasStmt->execute([$id_doctor]);


// Ahora eliminar el Doctor
$deleteDoctorStmt = $database->prepare("DELETE FROM Doctor WHERE id_doctor = ?");
$resultado = $deleteDoctorStmt->execute([$id_doctor]);

if($resultado) {
    echo '
    <script> 
        alert("El Doctor ha sido eliminada correctamente.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}
else {
    echo '
    <script> 
        alert("El Doctor NO pudo ser eliminado.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}