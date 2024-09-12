<?php
if(!isset($_POST["id_Secretaria"])) exit();
$id_Secretaria = $_POST["id_Secretaria"];
include_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

//Eliminar Citas que esten relacionadas con el Doctor
$deleteCitasStmt = $database->prepare("DELETE FROM Cita WHERE asignador = ?");
$deleteCitasStmt->execute([$id_Secretaria]);

$deletePublicacionAdmnStmt = $database->prepare("DELETE FROM Secretaria_Publicacion WHERE id_Secretaria = ?");
$deletePublicacionAdmnStmt->execute([$id_Secretaria]);




// Ahora eliminar el Administrativo
$deleteAdministrativoStmt = $database->prepare("DELETE FROM Secretaria WHERE id_Secretaria = ?");
$resultado = $deleteAdministrativoStmt->execute([$id_Secretaria]);

if($resultado) {
    echo '
    <script> 
        alert("La Secretaria ha sido eliminada correctamente.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}
else {
    echo '
    <script> 
        alert("La Secretaria NO pudo ser eliminada.");
        window.location.href = "../../views/admin/verRegistros.php";
    </script>
    ';
}