<?php 
require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

if(!isset($_POST["id_publicacion"])) exit();

$id_publicacion = $_POST["id_publicacion"];

$sentencia = $database -> prepare("DELETE FROM Publicacion WHERE id_publicacion = ?;");

$result = $sentencia->execute([$id_publicacion]);

if ($result) {
    echo '<script>
        alert("La publicacion ha sido eliminada.")
        window.location.href="../../views/admin/publications/verPublications.php"
        </script>';
    }else{
        echo'
        <script>
        alert("La publicacion NO se puede eliminar")
        window.location.href="../../views/admin/publications/verPublications.php"
        </script>
    ';
}
