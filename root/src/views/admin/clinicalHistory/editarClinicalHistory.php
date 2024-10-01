<?php
require_once '../../../../config/databaseConexion.php'; // Conexión a la base de datos

// Asegúrate de que tienes el ID del historial clínico en la URL
if (isset($_GET['id_historial_clinico'])) {
    $id_historial_clinico = $_GET['id_historial_clinico'];
    
    // Preparar la consulta para obtener el historial clínico
    $sql = "SELECT * FROM HistorialClinico WHERE id_historial_clinico = :id_historial_clinico";
    $stmt = $database->prepare($sql);
    $stmt->execute([':id_historial_clinico' => $id_historial_clinico]);

    // Obtener el historial como un array asociativo
    $historial = $stmt->fetch(PDO::FETCH_ASSOC);

/*     var_dump($historial);
 */
    // Verifica si se encontró el historial clínico
    if (!$historial) {
        echo "No se encontró ningún historial clínico con el ID especificado.";
        exit;
    }

    // Obtener el número de documento del paciente (si es necesario)
    $id_paciente = $historial['id_paciente'];
} else {
    echo "ID del historial clínico no proporcionado.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizar Historial Clínico</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f4f7f6;
            font-family: 'Arial', sans-serif;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: auto;
            margin-top: 7rem;
        }
        h2 {
            color: #ff914d;
            margin-bottom: 30px;
            font-size: 2.5rem;
            font-weight: 600;
        }
        .btn-primary {
            background-color: #ff914d;
            border-color: #ff914d;
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 1.1rem;
            font-weight: 500;
            transition: background-color 0.3s, border-color 0.3s;
        }
        .btn-primary:hover {
            background-color: #e68a3b;
            border-color: #e68a3b;
        }
        .form-label {
            color: #333;
            font-weight: 500;
        }
        .form-control {
            border-radius: 8px;
            border: 1px solid #ddd;
            padding: 10px;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        .form-control:focus {
            border-color: #ff914d;
            box-shadow: 0 0 0 0.2rem rgba(255, 145, 77, 0.25);
        }
        .mb-3 {
            margin-bottom: 1.5rem;
        }
        @media (max-width: 767.98px) {
            .container {
                padding: 20px;
            }
            h2 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>

    <?php require_once '../../../views/layouts/navbar.php'; ?>
    <div class="container">
        <h2 class="text-center">Actualizar Historial Clínico</h2>
        
        <!-- El formulario para actualizar el historial clínico -->
        <form action="../../../../controllers/clinicalHistoryController/updateClinicalHistory.php" method="post">
            
            <!-- Campo oculto para el ID del historial clínico -->
            <input type="hidden" name="id_historial_clinico" value="<?php echo htmlspecialchars($historial['id_historial_clinico']); ?>">
            
            <!-- Campo oculto para el ID del paciente -->
            <input type="hidden" name="id_paciente" value="<?php echo htmlspecialchars($id_paciente); ?>">
            
            <!-- Campo para la fecha de registro -->
            <div class="mb-3">
                <label for="fecha_registro" class="form-label">Fecha de Registro</label>
                <input type="text" class="form-control" id="fecha_registro" name="fecha_registro" value="<?php echo htmlspecialchars($historial['fecha_registro']); ?>" required>
            </div>

            <!-- Campo para el diagnóstico -->
            <div class="mb-3">
                <label for="diagnostico" class="form-label">Diagnóstico</label>
                <textarea class="form-control" id="diagnostico" name="diagnostico" rows="3" required><?php echo htmlspecialchars($historial['diagnostico']); ?></textarea>
            </div>
            
            <!-- Campo para el tratamiento -->
            <div class="mb-3">
                <label for="tratamiento" class="form-label">Tratamiento</label>
                <textarea class="form-control" id="tratamiento" name="tratamiento" rows="3"><?php echo htmlspecialchars($historial['tratamiento']); ?></textarea>
            </div>
            
            <!-- Campo para los procedimientos -->
            <div class="mb-3">
                <label for="procedimientos" class="form-label">Procedimientos</label>
                <textarea class="form-control" id="procedimientos" name="procedimientos" rows="3"><?php echo htmlspecialchars($historial['procedimientos']); ?></textarea>
            </div>

            <!-- Campo para las observaciones -->
            <div class="mb-3">
                <label for="observaciones" class="form-label">Observaciones</label>
                <textarea class="form-control" id="observaciones" name="observaciones" rows="3"><?php echo htmlspecialchars($historial['observaciones']); ?></textarea>
            </div>
            
            <!-- Campo para las alergias -->
            <div class="mb-3">
                <label for="alergias" class="form-label">Alergias</label>
                <textarea class="form-control" id="alergias" name="alergias" rows="3"><?php echo htmlspecialchars($historial['alergias']); ?></textarea>
            </div>
            
            <!-- Botón para enviar el formulario -->
            <button type="submit" class="btn btn-primary">Actualizar Historial Clínico</button>
        </form>
    </div>
    
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
