<?php
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Crear Publicación</title>
    <style>
        .bg-body-secondary{
            margin-top: 100px;
        }
        #previewImage {
            max-width: 100%;
            max-height: 300px;
            display: none;
            border: 1px solid #ccc;
            margin-top: 15px;
        }
        .profile-image-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .custom-file-input-wrapper label {
            background-color: #ff914d;
            color: white;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
        }
        .custom-file-input-wrapper input {
            display: none;
        }
    </style>
</head>
<body class="bg-body-secondary">
    <!-- Navbar -->
    <?php include_once '../../layouts/navbar.php'; ?>

    <main class="container my-4">
        <div class="row justify-content-center">
            <h1 class="mb-4 text-center" style="color:#ff914d">Crea una Publicación</h1>

            <form action="../../../controllers/publicationController/createPublication.php" method="POST" enctype="multipart/form-data">

                <div class="row mb-3">
                    <!-- Columna de selección de imagen -->
                    <div class="col-md-6 text-center">
                        <p for="imagen_publicacion" class="form-label">Imagen de la Publicación (opcional):</p>

                        <div class="profile-image-container">
                            <div class="custom-file-input-wrapper">
                                <label for="imagen_publicacion">Seleccionar foto</label>
                                <input type="file" id="imagen_publicacion" name="imagen_publicacion" accept="image/*">
                            </div>
                            <img id="previewImage" src="" alt="Vista previa de la imagen">
                        </div>
                    </div>

                    <!-- Columna de detalles de la publicación -->
                    <div class="col-md-6">
                        <p>Detalles de la Publicación</p>
                        <div class="mb-3">
                            <label for="titulo_publicacion" class="form-label">Título</label>
                            <input type="text" class="form-control" id="titulo_publicacion" name="titulo_publicacion" required>
                        </div>
                        <div class="mb-3">
                            <label for="contenido_publicacion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="contenido_publicacion" name="contenido_publicacion" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Crear Publicación</button>
                    </div>
                </div>
            </form>
        </div>
    </main>
    <!-- Footer -->
    <?php include_once '../../layouts/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('imagen_publicacion').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const previewImage = document.getElementById('previewImage');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '';
                previewImage.style.display = 'none';
            }
        });
    </script>
</body>
</html>
