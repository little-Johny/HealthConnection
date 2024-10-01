<?php  
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';
require_once '../../../controllers/publicationController/selectPublication.php';
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = '/HealthConnection/root/src/';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paublicaciones</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Estilos adicionales opcionales */
        .table-wrapper {
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .table thead th {
            background-color: #343a40;
            color: #fff;
        }
        .table-hover tbody tr:hover {
            background-color: #f1f1f1;
        }
    </style>
</head>
<body>

    <?php include_once '../../layouts/navbar.php';  ?>

    <div class="container mt-5">
        <div class="table-wrapper">
            <h2 class="text-center mb-4">Listado de Elementos</h2>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titulo</th>
                            <th>Contenido</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        <?php foreach ($publicaciones as $publicacion ) :?>
                            <tr>
                                <td><?= htmlspecialchars($publicacion-> id_publicacion) ?></td>
                                <td><?= htmlspecialchars($publicacion-> titulo) ?></td>
                                <td><?= htmlspecialchars($publicacion-> contenido) ?></td>
                                <td><?= htmlspecialchars($publicacion-> imagen_publicacion) ?></td>
                                <td>
                                    <a href="." class="btn btn-primary btn-sm">Editar</a>
                                    <a type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModalPublication<?php echo htmlspecialchars($publicacion->id_publicacion); ?>">Eliminar</a>

                                            <!-- Modal Confirmación Eliminación -->
                                            <div class="modal fade" id="confirmModalPublication<?php echo htmlspecialchars($publicacion->id_publicacion); ?>" tabindex="-1" role="dialog" aria-labelledby="confirmInputModalPublication" aria-hidden="true">
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="confirmInputModalPublication">Confirmar Eliminación</h5>
                                                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            ¿Estás seguro de que deseas eliminar esta publicacion?
                                                        </div>
                                                        <div class="modal-footer">
                                                            <form action="../../../controllers/publicationController/deletePublication.php" method="POST">
                                                                <input type="hidden" name="id_publicacion" value="<?php echo htmlspecialchars($publicacion->id_publicacion); ?>">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                                <button type="submit" class="btn btn-danger">Eliminar</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                </td>
                            </tr>
                        <?php endforeach ; ?>    
                        
                    </tbody>
                </table>
            </div>
        </div>

        <div class="section-buttons">
            <button onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/publications/formPublications.php';" class="btn btn-sm btn-primary">Crear publicacion</button>
        </div>
    </div>

<?php include_once '../../layouts/footer.php';  ?>
<!-- Bootstrap 5 JS y dependencias -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js">    
</script>
</body>    
</html>