<?php
include_once "../../../config/databaseConexion.php";

// Suponiendo que tienes una forma de obtener el ID del paciente desde la sesión o parámetros
$numero_documento = $_GET['numero_documento']; // O de otra fuente según tu aplicación

// Consultar la base de datos para obtener la información del paciente
$sql = "SELECT nombre, apellido, email, foto_perfil FROM paciente WHERE numero_documento = ?";
$stmt = $database->prepare($sql);
$stmt->execute([$numero_documento]);
$paciente = $stmt->fetch(PDO::FETCH_ASSOC);

$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = 'C:/xampp/htdocs/HealthConnection/root/src/';
$baseUrlSrcFooter = 'C:/xampp/htdocs/HealthConnection/root/src/';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Perfil</title>
    <!-- Enlace a Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic; ?>images/tab_icon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/admin/editarPerfil.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    
</head>
<body class="bg-body-secondary">

    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>

    <main class="container my-5">
        <section style="border-radius:8px; border:1px solid #6C5F5B; padding:20px; box-shadow: 10px 8px 16px #4F4A45; ">
            <h1 class="mb-4" style="display: flex; justify-content:center; color:#ff914d">Editar Perfil</h1>

            <form action="procesar-perfil.php" method="post" enctype="multipart/form-data">
                <!-- Foto de Perfil -->
                <div class="mb-4 text-center">
                    <h2 class="h5">Foto de Perfil</h2>
                    <div class="mb-3">
                        <!-- Mostrar la foto de perfil actual -->
                        <img src="<?php echo $baseUrlPublic; ?>images/<?php echo htmlspecialchars($paciente['foto_perfil']); ?>" alt="Foto de perfil" class="img-thumbnail mb-3" style="width: 150px; height: 150px; object-fit: cover;">
                        <input type="file" id="fotoPerfil" name="fotoPerfil" class="form-control">
                    </div>
                </div>

                <!-- Información Personal -->
                <div class="mb-4">
                    <h2 class="h5">Información Personal</h2>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nombre" class="form-label">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" class="form-control" value="<?php echo htmlspecialchars($paciente['nombre']); ?>" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="apellido" class="form-label">Apellido:</label>
                            <input type="text" id="apellido" name="apellido" class="form-control" value="<?php echo htmlspecialchars($paciente['apellido']); ?>" required>
                        </div>
                        <div class="col-12">
                            <label for="email" class="form-label">Correo Electrónico:</label>
                            <input type="email" id="email" name="email" class="form-control" value="<?php echo htmlspecialchars($paciente['email']); ?>" required>
                        </div>
                    </div>
                </div>

                <!-- Cambiar Contraseña -->
                <div class="mb-4">
                    <h2 class="h5">Cambiar Contraseña</h2>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label for="current-password" class="form-label">Contraseña Actual:</label>
                            <input type="password" id="current-password" name="current-password" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="new-password" class="form-label">Nueva Contraseña:</label>
                            <input type="password" id="new-password" name="new-password" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="confirm-password" class="form-label">Confirmar Nueva Contraseña:</label>
                            <input type="password" id="confirm-password" name="confirm-password" class="form-control" required>
                        </div>
                    </div>
                </div>

                <!-- Preferencias -->
                <div class="mb-4">
                    <h2 class="h5">Preferencias</h2>
                    <div class="mb-3">
                        <label for="notifications" class="form-label">Notificaciones:</label>
                        <select id="notifications" name="notifications" class="form-select">
                            <option value="email">Correo Electrónico</option>
                            <option value="sms">SMS</option>
                            <option value="none">Ninguna</option>
                        </select>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="d-flex justify-content-center" >
                    <button type="submit" class="btn btn-primary" style="margin:20px 20px 20px 20px;">Guardar Cambios</button>
                    <button type="reset" class="btn btn-secondary" style="margin:20px 20px 20px 20px;">Cancelar</button>
                </div>
            </form>
        </section>
    </main>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter.'views/layouts/footer.php'; ?>
</body>
</html>
