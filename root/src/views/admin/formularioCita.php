<?php 

require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = 'C:/xampp/htdocs/HealthConnection/root/src/'; // Ruta base absoluta para archivos PHP
$baseUrlSrcFooter = 'C:/xampp/htdocs/HealthConnection/root/src/';

// Obtener las categorias existentes desde la base de datos para poblar el campo select de categoria
$tiposcitas = [];
try {
    $consultaTiposcitas = $database->query("SELECT id_tipo, nombre_tipo, costo_adicional FROM TipoCita");
    $tiposcitas = $consultaTiposcitas->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener Tipo de cita: " . $error->getMessage();
}

// Obtener las especialidades existentes desde la base de datos para poblar el campo select de especialidad
$especialidades = [];
try {
    $consultaEspecialidades = $database->query("SELECT id_especialidad, nombre_especialidad, costo FROM Especialidad");
    $especialidades = $consultaEspecialidades->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener Especialidades: " . $error->getMessage();
}

// Obtener los doctores existentes desde la base de datos para poblar el campo select de doctor
$doctores = [];
try {
    $consultaDoctores = $database->query("SELECT id_doctor, nombre, apellido FROM Doctor");
    $doctores = $consultaDoctores->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener Doctor: " . $error->getMessage();
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Connection - Agenda tu cita</title>
    <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/admin/formularioCita.css">
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic; ?>images/tab_icon.png" type="image/x-icon">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-body-secondary">
    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>
    <header id="navbar"></header>

    <main class="container my-3">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="appointment-container">
                    <div class="form">
                        <h2>Agenda tu cita</h2>
                    </div>
                    <div class="appointment-form">
                    <form action="<?php echo $baseUrlSrc;?>controllers/procesarCita.php" method="post">
                            <div class="mb-3">
                                <label for="doc_paciente" class="form-label">Documento del paciente</label>
                                <input type="text" name="doc_paciente" id="doc_paciente" class="form-control" placeholder="1012345424">
                            </div>
                            
                            <div class="mb-3">
                                <label for="specialty" class="form-label">Selecciona la especialidad</label>
                                <select id="specialty" name="specialty" class="form-select" onchange="actualizarCosto()">
                                    <option value="">--Selecciona--</option>
                                    <?php foreach ($especialidades as $especialidad) : ?>
                                        <option value="<?= $especialidad['id_especialidad']; ?>" data-costo="<?= $especialidad['costo']; ?>"><?= $especialidad['nombre_especialidad']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="type" class="form-label">Selecciona el tipo de cita</label>
                                <select id="type" name="type" class="form-select" onchange="actualizarCosto()">
                                    <option value="">--Selecciona--</option>
                                    <?php foreach ($tiposcitas as $tipo) : ?>
                                        <option value="<?= $tipo['id_tipo']; ?>" data-costo="<?= $tipo['costo_adicional']; ?>"><?= $tipo['nombre_tipo']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">¿Quieres solicitar un médico?</label>
                                <div>
                                    <label class="form-check-label me-3"><input type="radio" name="specific_doctor" value="si" class="form-check-input"> Sí</label>
                                    <label class="form-check-label"><input type="radio" name="specific_doctor" value="no" class="form-check-input"> No</label>
                                </div>
                                <select id="preferred_doctor" name="preferred_doctor" class="form-select mt-3" disabled>
                                    <option value="">--Selecciona--</option>
                                    <?php foreach ($doctores as $doctor) : ?>
                                        <option value="<?= $doctor['id_doctor']; ?>"><?= $doctor['nombre'] . ' ' . $doctor['apellido']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="date" class="form-label">Fecha de la cita:</label>
                                <input type="date" id="date" name="date" class="form-control">
                            </div>

                            <div class="mb-3">
                                <label for="time" class="form-label">Hora de la cita:</label>
                                <input type="time" id="time" name="time" class="form-control">
                            </div>

                            <!-- Campo para mostrar el costo de la cita -->
                            <div class="mb-3">
                                <label for="costo" class="form-label">Costo de la cita:</label>
                                <input type="text" id="costo" name="costo" class="form-control" readonly>
                            </div>

                            <!-- Autorización (Validar si es necesaria según la categoría seleccionada) -->
                            <div class="mb-3">
                                <label for="autorization" class="form-label">Autorización</label>
                                <input type="file" name="autorization" class="form-control">
                            </div>

                            <button type="submit" class="btn btn-primary">Agendar cita</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter . 'views/layouts/footer.php'; ?>

    <script>
        // JavaScript para habilitar/deshabilitar el campo del doctor preferido
        document.querySelectorAll('input[name="specific_doctor"]').forEach((elem) => {
            elem.addEventListener("change", function(event) {
                var preferredDoctorSelect = document.getElementById("preferred_doctor");
                if (event.target.value === "si") {
                    preferredDoctorSelect.disabled = false;
                } else {
                    preferredDoctorSelect.disabled = true;
                }
            });
        });

        // JavaScript para actualizar el costo de la cita según la especialidad y tipo de cita seleccionados
        function actualizarCosto() {
            var selectEspecialidad = document.getElementById("specialty");
            var selectTipo = document.getElementById("type");
            var costoInput = document.getElementById("costo");

            // Obtener el costo de la opción seleccionada para especialidad
            var costoEspecialidad = selectEspecialidad.options[selectEspecialidad.selectedIndex].getAttribute("data-costo");
            costoEspecialidad = parseFloat(costoEspecialidad) || 0; // Convertir a número, o 0 si no hay valor

            // Obtener el costo de la opción seleccionada para tipo de cita
            var costoTipo = selectTipo.options[selectTipo.selectedIndex].getAttribute("data-costo");
            costoTipo = parseFloat(costoTipo) || 0; // Convertir a número, o 0 si no hay valor

            // Calcular el costo total
            var costoTotal = costoEspecialidad + costoTipo;

            // Actualizar el campo de costo con el valor total
            costoInput.value = costoTotal.toFixed(2); // Formatear a dos decimales
        }
    </script>
</body>
</html>
