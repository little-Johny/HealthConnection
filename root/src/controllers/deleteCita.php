<?php
if(!isset($_POST["id_cita"])) exit();
$id = $_POST["id_cita"];
include_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';
$sentencia = $database->prepare("DELETE FROM Cita WHERE id_cita = ?;");
$resultado = $sentencia->execute([$id]);
if($resultado) {
    echo '
    <script> 
        alert("La cita ha sido eliminada correctamente.");
        window.location.href = "../views/admin/verSolicitudes.php";
    </script>
    ';
}
else {
    echo '
    <script> 
        alert("La cita NO pudo ser eliminada.");
        window.location.href = "verSolicitudes.php";
    </script>
    ';
}

