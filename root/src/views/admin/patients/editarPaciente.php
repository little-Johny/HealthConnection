<?php
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

// Verificar si se ha proporcionado el número de documento
if (!isset($_GET["numero_documento"]) || empty($_GET["numero_documento"])) {
    echo "ID de Paciente no proporcionado.";
    exit();
}

$numero_documento = $_GET["numero_documento"];

// Consulta para obtener los datos del paciente, incluyendo dirección y ciudad
$direccionSentence = $database->prepare("
    SELECT p.numero_documento, p.nombre, p.apellido, p.email, p.telefono, d.direccion, c.nombre_ciudad AS ciudad_nombre, p.id_plan_afiliacion, p.foto_perfil, c.id_ciudad
    FROM Paciente p
    LEFT JOIN Direccion d ON p.direccion = d.id_direccion
    LEFT JOIN Ciudad c ON d.id_ciudad = c.id_ciudad
    WHERE p.numero_documento = ?
");
$direccionSentence->execute([$numero_documento]);
$pacientes = $direccionSentence->fetch(PDO::FETCH_ASSOC);

if ($pacientes === false) {
    echo "¡No existe ningún paciente con ese número de documento!";
    exit();
}

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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-body-secondary">

    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>

    <main class="container my-5">
        <section style="border-radius:8px; border:1px solid #6C5F5B; padding:20px; box-shadow: 10px 8px 16px #4F4A45;">
            <h1 class="mb-4" style="display: flex; justify-content:center; color:#ff914d">Editar Perfil</h1>

            <form action="<?php echo $baseUrlSrc;?>controllers/patientController/updatePaciente.php" method="post" enctype="multipart/form-data">
                <!-- Foto de Perfil -->
                <input type="hidden" name="numero_documento" value="<?php echo htmlspecialchars($pacientes['numero_documento']); ?>">
                <div class="mb-4 text-center">
                    <h2 class="h5">Foto de Perfil</h2>
                    <div class="mb-3">
                        <!-- Mostrar la foto de perfil actual -->
                        <img src="<?php echo $baseUrlPublic; ?>uploads/patients/<?php echo htmlspecialchars($pacientes['foto_perfil']); ?>" alt="Foto de perfil" class="img-thumbnail mb-3" style="width: 150px; height: 150px; object-fit: cover;">
                        <input type="file" id="fotoPerfil" name="fotoPerfil" class="form-control">
                    </div>
                </div>

                <!-- Información Personal -->
                <div class="mb-4">
                    <h2 class="h5">Información Personal</h2>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nombre" class="form-label">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" class="form-control" value="<?php echo htmlspecialchars($pacientes['nombre']); ?>" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="apellido" class="form-label">Apellido:</label>
                            <input type="text" id="apellido" name="apellido" class="form-control" value="<?php echo htmlspecialchars($pacientes['apellido']); ?>" required>
                        </div>
                        <div class="col-12">
                            <label for="email" class="form-label">Correo Electrónico:</label>
                            <input type="email" id="email" name="email" class="form-control" value="<?php echo htmlspecialchars($pacientes['email']); ?>" required>
                        </div>
                        <div class="col-12">
                            <label for="telefono" class="form-label">Teléfono:</label>
                            <input type="text" id="telefono" name="telefono" class="form-control" value="<?php echo htmlspecialchars($pacientes['telefono']); ?>">
                        </div>
                    </div>
                </div>

                <!-- Información de Ubicación -->
                <div class="mb-3">
                    <div class="col-12">
                        <label for="ciudad" class="form-label">Ciudad:</label>
                        <select id="ciudad" name="ciudad" class="form-select" required>
                            <!-- Opciones de ciudades -->
                            <?php
                            $stmt = $database->query("SELECT id_ciudad, nombre_ciudad FROM Ciudad");
                            $ciudades = $stmt->fetchAll(PDO::FETCH_ASSOC);

                            foreach ($ciudades as $ciudad) {
                                $selected = ($ciudad['id_ciudad'] == $pacientes['id_ciudad']) ? 'selected' : '';
                                echo "<option value=\"{$ciudad['id_ciudad']}\" $selected>{$ciudad['nombre_ciudad']}</option>";
                            }
                            ?>
                        </select>
                    </div>
                    <div class="mb-4 col-12">
                        <label for="direccion" class="form-label">Dirección:</label>
                        <input type="text" id="direccion" name="direccion" class="form-control" value="<?php echo htmlspecialchars($pacientes['direccion']); ?>" required>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" style="margin:20px;">Guardar Cambios</button>
                    <button type="reset" class="btn btn-secondary" style="margin:20px;">Cancelar</button>
                </div>
            </form>
        </section>
    </main>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter.'views/layouts/footer.php'; ?>
</body>
</html>
