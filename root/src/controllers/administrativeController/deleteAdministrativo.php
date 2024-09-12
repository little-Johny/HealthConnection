<?php
if(!isset($_POST["id_Administrativos"])) exit();
$id_Administrativos = $_POST["id_Administrativos"];
include_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

// Eliminar las autorizaciones relacionadas
$deleteAutorizacionesStmt = $database->prepare("DELETE FROM Autorizacion WHERE asignador = ?");
$deleteAutorizacionesStmt->execute([$id_Administrativos]);

//Eliminar Citas que esten relacionadas con el Doctor
$deleteCitasStmt = $database->prepare("DELETE FROM Cita WHERE asignador = ?");
$deleteCitasStmt->execute([$id_Administrativos]);

$deletePublicacionAdmnStmt = $database->prepare("DELETE FROM Administrativos_Publicacion WHERE id_Administrativos = ?");
$deletePublicacionAdmnStmt->execute([$id_Administrativos]);




// Ahora eliminar el Administrativo
$deleteAdministrativoStmt = $database->prepare("DELETE FROM Administrativos WHERE id_Administrativos = ?");
$resultado = $deleteAdministrativoStmt->execute([$id_Administrativos]);

if($resultado) {
    echo '
    <script> 
        alert("El Administrativo ha sido eliminada correctamente.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}
else {
    echo '
    <script> 
        alert("El Administrativo NO pudo ser eliminado.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}