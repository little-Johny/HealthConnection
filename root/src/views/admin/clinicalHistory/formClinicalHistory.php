<?php 
// Asegurarse de que el id_paciente esté en la URL
if (!isset($_GET['id_paciente'])) {
    echo "Error: No se ha proporcionado el ID del paciente.";
    exit;
}

// Obtener el ID del paciente de la URL (en realidad es numero_documento)
$id_paciente = $_GET['id_paciente'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar Historial Clínico</title>
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
            margin-top: 5rem;
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
    <div class="container">
        <h2 class="text-center">Registrar Historial Clínico</h2>
        <form action="../../../controllers/clinicalHistoryController/createHistory.php" method="post">
            <div class="mb-3">
                <label for="id_paciente" class="form-label">Número de Documento del Paciente</label>
                <!-- Campo precargado con el ID del paciente -->
                <input type="text" class="form-control" id="id_paciente" name="id_paciente" value="<?php echo htmlspecialchars($id_paciente); ?>" readonly>

            </div>

            <div class="mb-3">
                <label for="diagnostico" class="form-label">Diagnóstico</label>
                <textarea class="form-control" id="diagnostico" name="diagnostico" rows="3" required></textarea>
            </div>

            <div class="mb-3">
                <label for="tratamiento" class="form-label">Tratamiento</label>
                <textarea class="form-control" id="tratamiento" name="tratamiento" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label for="procedimientos" class="form-label">Procedimientos</label>
                <textarea class="form-control" id="procedimientos" name="procedimientos" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label for="observaciones" class="form-label">Observaciones</label>
                <textarea class="form-control" id="observaciones" name="observaciones" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label for="alergias" class="form-label">Alergias</label>
                <textarea class="form-control" id="alergias" name="alergias" rows="3"></textarea>
            </div>

            <button type="submit" class="btn btn-primary">Registrar Historial Clínico</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
