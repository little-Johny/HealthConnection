<?php
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

// Verificar si se ha proporcionado el ID del doctor
if (!isset($_GET["id_doctor"]) || empty($_GET["id_doctor"])) {
    echo "ID de Doctor no proporcionado.";
    exit();
}

$id_doctor = $_GET["id_doctor"];

// Consultar la base de datos para obtener la información del doctor
$stmt = $database->prepare("SELECT d. id_doctor, d. nombre, d. apellido, d. tipo_documento, d. numero_documento, d. telefono, d.email, 
    dir. direccion AS direccion_completa, e. id_especialidad, e. nombre_especialidad, r. nombre_rol, d. foto_perfil, d. genero, c. nombre_ciudad AS ciudad_nombre
FROM Doctor d
JOIN Direccion dir ON d. direccion = dir. id_direccion
JOIN Ciudad c ON dir. id_ciudad = c. id_ciudad
JOIN Especialidad e ON d. id_especialidad = e. id_especialidad
JOIN Rol r ON d. id_rol = r. id_rol
WHERE d. id_doctor = ?;");
$stmt->execute([$id_doctor]);
$doctor = $stmt->fetch(PDO::FETCH_ASSOC);

if ($doctor === false) {
    echo "¡No existe ningún doctor con ese ID!";
    exit();
}

// Obtener las ciudades existentes desde la base de datos para poblar el campo select de ciudad
$ciudades = [];
try {
    $consultaCiudad = $database->query("SELECT id_ciudad, nombre_ciudad FROM Ciudad");
    $ciudades = $consultaCiudad->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener ciudades: " . $error->getMessage();
}

// Obtener especialidades existentes
$especialidades = [];
try {
    $consultaEspecialidad = $database->query("SELECT id_especialidad, nombre_especialidad FROM Especialidad");
    $especialidades = $consultaEspecialidad->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener especialidades: " . $error->getMessage();
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
    <title>Editar Doctor</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/admin/editarDoctor.css">
</head>
<body class="bg-light">
    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>

    <div class="container my-5">
        <h1 class="text-center">Editar Información del Doctor</h1>
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <form action="<?php echo $baseUrlSrc;?>controllers/doctorController/updateDoctor.php" method="post" enctype="multipart/form-data">
                    <!-- Foto de Perfil -->
                    <div class="mb-4 text-center">
                        <h2 class="h5">Foto de Perfil</h2>
                        <div class="mb-3">
                            <img src="<?php echo $baseUrlPublic; ?>uploads/doctors/<?php echo htmlspecialchars($doctor['foto_perfil']); ?>" alt="Foto de perfil" class="img-thumbnail mb-3" style="width: 150px; height: 150px; object-fit: cover;">
                            <input type="file" id="fotoPerfil" name="fotoPerfil" class="form-control">
                        </div>
                    </div>

                    <!-- Información Personal -->
                    <div class="mb-4">
                        <h2 class="h5">Información Personal</h2>
                        <input type="hidden" name="id_doctor" value="<?php echo htmlspecialchars($doctor['id_doctor']); ?>">

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="nombre" class="form-label">Nombre:</label>
                                <input type="text" id="nombre" name="nombre" class="form-control" value="<?php echo htmlspecialchars($doctor['nombre']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="apellido" class="form-label">Apellido:</label>
                                <input type="text" id="apellido" name="apellido" class="form-control" value="<?php echo htmlspecialchars($doctor['apellido']); ?>" required>
                            </div>
                        </div>

                        <!-- Especialidad -->
                        <div class="mb-3">
                            <label for="especialidad" class="form-label">Especialidad:</label>
                            <select id="especialidad" name="especialidad" class="form-select" required>
                                <?php

                                foreach ($especialidades as $especialidad) {
                                    $selected = ($especialidad['id_especialidad'] == $doctor['id_especialidad']) ? 'selected' : '';
                                    echo "<option value=\"{$especialidad['id_especialidad']}\" $selected>{$especialidad['nombre_especialidad']}</option>";
                                }

                                ?>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Correo Electrónico:</label>
                            <input type="email" id="email" name="email" class="form-control" value="<?php echo htmlspecialchars($doctor['email']); ?>" required>
                        </div>
                        <div class="mb-3">
                            <label for="telefono" class="form-label">Teléfono:</label>
                            <input type="text" id="telefono" name="telefono" class="form-control" value="<?php echo htmlspecialchars($doctor['telefono']); ?>">
                        </div>

                        <!-- Dirección y Ciudad -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="direccion" class="form-label">Dirección:</label>
                                <input type="text" id="direccion" name="direccion" class="form-control" value="<?php echo htmlspecialchars($doctor['direccion_completa']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                            <label for="ciudad" class="form-label">Ciudad:</label>
                        <select id="ciudad" name="ciudad" class="form-select" required>
                            <!-- Opciones de ciudades -->
                            <?php

                            foreach ($ciudades as $ciudad) {
                                $selected = ($ciudad['id_ciudad'] == $doctor['id_ciudad']) ? 'selected' : '';
                                echo "<option value=\"{$ciudad['id_ciudad']}\" $selected>{$ciudad['nombre_ciudad']}</option>";
                            }
                            
                            ?>
                        </select>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de Acción -->
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                        <a href="../views/admin/verDoctores.php" class="btn btn-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter . 'views/layouts/footer.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
