<?php 
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = '/HealthConnection/root/src/'; // Ajustar la ruta base

if (!isset($_GET["id_cita"]) || empty($_GET["id_cita"])) {
    echo "ID de cita no proporcionado.";
    exit();
}

$id = $_GET["id_cita"];
include_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

$sentencia = $database->prepare("SELECT * FROM Cita WHERE id_cita = ?;");
$sentencia->execute([$id]);
$citas = $sentencia->fetch(PDO::FETCH_OBJ);

if ($citas === false) {
    echo "¡No existe ninguna cita con ese ID!";
    exit();
}

// Obtener los tipos de cita
$tiposcitas = [];
try {
    $consultaTiposcitas = $database->query("SELECT id_tipo, nombre_tipo, costo_adicional FROM TipoCita");
    $tiposcitas = $consultaTiposcitas->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener Tipo de cita: " . $error->getMessage();
}

// Obtener las especialidades
$especialidades = [];
try {
    $consultaEspecialidades = $database->query("SELECT id_especialidad, nombre_especialidad, costo FROM Especialidad");
    $especialidades = $consultaEspecialidades->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener Especialidades: " . $error->getMessage();
}

// Obtener los doctores
$doctores = [];
try {
    $consultaDoctores = $database->query("SELECT id_doctor, nombre, apellido, id_especialidad FROM Doctor");
    $doctores = $consultaDoctores->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    echo "Error al obtener Doctores: " . $error->getMessage();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="<?php echo htmlspecialchars($baseUrlPublic); ?>css/admin/editarCita.css">
    <link rel="shortcut icon" href="../Images/tab_icon.png" type="image/x-icon">
    <title>Detalles de Citas Médicas</title>
</head>
<body class="bg-body-secondary">
    <!-- Navbar -->
    <?php include '../../layouts/navbar.php'; ?>

    <main class="edit-container">
        <section id="edit">
            <h2>Edita</h2>
            <form action="<?php echo $baseUrlSrc;?>controllers/appointmentController/updateCitas.php" method="post" enctype="multipart/form-data">
                <input type="hidden" name="id_cita" value="<?php echo htmlspecialchars($citas->id_cita); ?>">

                <div class="form-group">
                    <label for="specialty">Selecciona la especialidad</label>
                    <select id="specialty" name="specialty" required>
                        <option value="">--selecciona--</option>
                        <?php foreach ($especialidades as $especialidad) : ?>
                            <option value="<?= htmlspecialchars($especialidad['id_especialidad']); ?>" data-costo="<?= htmlspecialchars($especialidad['costo']); ?>" <?= ($citas->especialidad === $especialidad['id_especialidad']) ? 'selected' : ''; ?>>
                                <?= htmlspecialchars($especialidad['nombre_especialidad']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="type">Selecciona un tipo de cita</label>
                    <select id="type" name="type" required>
                        <option value="">--selecciona--</option>
                        <?php foreach ($tiposcitas as $tipo) : ?>
                            <option value="<?= htmlspecialchars($tipo['id_tipo']); ?>" data-costo="<?= htmlspecialchars($tipo['costo_adicional']); ?>" <?= ($citas->tipo_cita === $tipo['id_tipo']) ? 'selected' : ''; ?>>
                                <?= htmlspecialchars($tipo['nombre_tipo']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label>¿Quieres solicitar un médico?</label>
                    <label><input type="radio" name="specific-doctor" value="si" <?= ($citas->id_doctor !== null) ? 'checked' : ''; ?>> Sí</label>
                    <label><input type="radio" name="specific-doctor" value="no" <?= ($citas->id_doctor === null) ? 'checked' : ''; ?>> No</label>
                    <select id="preferred-doctor" name="preferred-doctor" <?= ($citas->id_doctor !== null) ? '' : 'disabled'; ?>>
                        <option value="">Selecciona el médico de tu preferencia</option>
                        <?php foreach ($doctores as $doctor) : ?>
                            <option value="<?= htmlspecialchars($doctor['id_doctor']); ?>" data-specialty="<?= htmlspecialchars($doctor['id_especialidad']); ?>" <?= ($citas->id_doctor === $doctor['id_doctor']) ? 'selected' : ''; ?>>
                                <?= htmlspecialchars($doctor['nombre']) . ' ' . htmlspecialchars($doctor['apellido']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="date">Fecha de la cita:</label>
                    <input type="date" id="date" name="date" value="<?php echo htmlspecialchars($citas->fecha); ?>" required>
                </div>
                <div class="form-group">
                    <label for="time">Hora de la cita:</label>
                    <input type="time" id="time" name="time" value="<?php echo htmlspecialchars($citas->hora); ?>" required>
                </div>
                <!-- Campo para mostrar el costo de la cita -->
                <div class="mb-3 form-group">
                    <label for="costo" class="form-label">Costo de la cita:</label>
                    <input type="text" id="costo" name="costo" class="form-control"  value="<?php echo htmlspecialchars($citas->costo); ?>" readonly>
                </div>

                <!-- Autorización (Validar si es necesaria según la categoría seleccionada) -->
                <div class="mb-3">
                    <label for="autorization" class="form-label">Autorización</label>
                    <input type="file" name="autorization" class="form-control">
                    <?php if (!empty($citas->requiere_autorizacion)): ?>
                        <a href="<?php echo htmlspecialchars($baseUrlPublic . 'uploads/' . $citas->requiere_autorizacion); ?>" target="_blank">Ver archivo actual</a>
                    <?php endif; ?>
                </div>            
                
                <div class="buttons">
                    <button type="submit" class="btn btn-primary">Confirmar</button>
                    <button type="button" class="btn btn-secondary" onclick="window.location.href='../verSolicitudes.php'">Cancelar</button>
                </div>
            </form>
        </section>
    </main>
    <!-- Footer -->
    <?php include '../../layouts/footer.php'; ?>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const radioButtons = document.querySelectorAll('input[name="specific-doctor"]');
            const doctorSelect = document.getElementById('preferred-doctor');
            const specialtySelect = document.getElementById('specialty');

            radioButtons.forEach(radio => {
                radio.addEventListener('change', function() {
                    doctorSelect.disabled = this.value !== 'si';
                    if (this.value === 'no') {
                        doctorSelect.value = "";
                    }
                });
            });

            specialtySelect.addEventListener('change', function() {
                const selectedSpecialty = this.value;
                const doctorOptions = doctorSelect.querySelectorAll('option');

                doctorOptions.forEach(option => {
                    if (option.value === "" || option.getAttribute('data-specialty') === selectedSpecialty) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                });
            });

            // Trigger the change event to filter doctors on page load if a specialty is already selected
            specialtySelect.dispatchEvent(new Event('change'));
        });
        document.addEventListener('DOMContentLoaded', function() {
        const specialtySelect = document.getElementById('specialty');
        const typeSelect = document.getElementById('type');
        const costoInput = document.getElementById('costo');

        function updateCost() {
            const selectedSpecialty = specialtySelect.options[specialtySelect.selectedIndex];
            const selectedType = typeSelect.options[typeSelect.selectedIndex];

            const specialtyCost = parseFloat(selectedSpecialty.getAttribute('data-costo')) || 0;
            const typeCost = parseFloat(selectedType.getAttribute('data-costo')) || 0;

            const totalCost = specialtyCost + typeCost;
            costoInput.value = totalCost.toFixed(2);
        }

        specialtySelect.addEventListener('change', updateCost);
        typeSelect.addEventListener('change', updateCost);
    });
    </script>
</body>
</html>
