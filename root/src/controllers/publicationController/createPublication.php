<?php

require_once '../../../config/databaseConexion.php';

try {
    $imagen_publicacion = null; // Inicializamos la variable para la imagen
    $titulo_publicacion = $_POST['titulo_publicacion'];
    $contenido_publicacion = $_POST['contenido_publicacion'];

    // Almacenamiento de imágenes
    if (isset($_FILES['imagen_publicacion']) && $_FILES['imagen_publicacion']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = $_FILES['imagen_publicacion']['name'];
        $tipoArchivo = mime_content_type($_FILES['imagen_publicacion']['tmp_name']);
        $tamañoArchivo = $_FILES['imagen_publicacion']['size'];

        // Verificar que sea una imagen válida y su tamaño sea adecuado
        if (($tipoArchivo === 'image/jpeg' || $tipoArchivo === 'image/png') && $tamañoArchivo < 7000000) { // 7MB máximo
            $rutaTemporal = $_FILES['imagen_publicacion']['tmp_name'];
            $directorioDestino = '../../../public/uploads/publications/';
            $rutaArchivo = $directorioDestino . uniqid() . '_' . $nombreArchivo;

            // Mover el archivo al directorio de destino
            if (move_uploaded_file($rutaTemporal, $rutaArchivo)) {
                $imagen_publicacion = $rutaArchivo; // Guardamos la ruta de la imagen para insertarla en la BD
            } else {
                throw new Exception("Error al subir la imagen.");
            }
        } else {
            throw new Exception("Formato o tamaño de archivo no válido.");
        }
    }

    // Sentencia SQL para insertar la publicación
    $sentenciaPublicacion = $database->prepare("INSERT INTO Publicacion (imagen_publicacion, titulo, contenido) VALUES (?, ?, ?);");

    // Ejecutar la sentencia con los valores: ruta de la imagen (o null), título y contenido
    $result = $sentenciaPublicacion->execute([$imagen_publicacion, $titulo_publicacion, $contenido_publicacion]);

    if ($result) {
        echo "<script>
            alert('Publicación exitosa');
            window.location.href = '../../../public/index.php';
        </script>";
    } else {
        echo "<script>
            alert('Algo salió mal, no se pudo realizar la publicación');
            window.location.href = '../../../public/index.php';
        </script>";
    }

} catch (PDOException $error) {
    echo 'Error de base de datos: ' . $error->getMessage();
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
