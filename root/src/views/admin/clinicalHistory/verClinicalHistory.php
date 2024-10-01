<?php
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

// Verificar si se ha proporcionado el número de documento
if (!isset($_GET["numero_documento"]) || empty($_GET["numero_documento"])) {
    echo "ID de Paciente no proporcionado.";
    exit();
}

$numero_documento = $_GET["numero_documento"];

$consultaPaciente = $database->prepare("SELECT * FROM Paciente WHERE numero_documento = ?");
$consultaPaciente->execute([$numero_documento]);

// Obtener los datos del paciente
$paciente = $consultaPaciente->fetch(PDO::FETCH_ASSOC);

// Verificar si se encontró el paciente
if (!$paciente) {
    echo "Paciente no encontrado.";
    exit();
}

$consultaHistorial =$database->prepare("SELECT * FROM HistorialClinico WHERE id_paciente = ?");
$consultaHistorial->execute([$numero_documento]);

$historial = $consultaHistorial->fetch(PDO::FETCH_ASSOC);


?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial del Paciente</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
    </script>

    <style>
        /* Estilos personalizados para la vista */
        @import url('https://fonts.googleapis.com/css2?family=Coustard:wght@400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

        :root {
            --color-principal: #ff914d;
            --color-secundario: #6C5F5B;
            --color-complementario: #4F4A45;
            --negro: #151515;
            --gris-clarito: #9f9e9ed4;
            --white: #FFFFFF;
            --fuente-principal: "Roboto Mono", monospace;
            --fuente-secundaria: 'Nunito', sans-serif;
            --small-font: 14px;
            --medium-font: 16px;
            --large-font: 18px;
            --gris-fondo: #e8e5e5;
            --logo-font: "Coustard", serif;
        }

        body {
            font-family: var(--fuente-principal);
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
        }

        header {
            background-color: var(--color-principal);
            color: white;
            padding: 1em;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        main {
            padding: 2em;
            max-width: 900px;
            margin: 2em auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: var(--color-principal);
            font-size: 1.75em;
            font-weight: 600;
            border-bottom: 2px solid var(--color-principal);
            padding-bottom: 0.5em;
            margin-bottom: 1em;
        }

        .footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .social-media a {
            color: white;
            margin-right: 10px;
        }

        .bg-body-secondary {
            margin-top: 140px;
        }
    </style>
</head>

<body class="bg-body-secondary">
    
    <!-- Navbar -->
    <?php include_once  '../../layouts/navbar.php'; ?>

    <main class="container my-4">
        <!-- Sección 1: Información básica del paciente traída de la tabla de pacientes -->
        <section class="patient-info">
            <h2 class="text-custom">Información del Paciente</h2>
            <dl class="row">
                <div class="col-md-4">
                    <dt>Nombre:</dt>
                    <p><?php echo htmlspecialchars($paciente['nombre'].''.$paciente['apellido']); ?></p>
                </div>
                <div class="col-md-4">
                    <dt>Fecha Nacimiento:</dt>
                    <p><?php echo htmlspecialchars($paciente['fecha_de_nacimiento']); ?></p>
                </div>
                <div class="col-md-4">
                    <dt>numero documento:</dt>
                    <p><?php echo htmlspecialchars($paciente['numero_documento']); ?></p>
                </div>
            </dl>
        </section>

        <!-- Sección 2: Historial médico del paciente, datos traídos de la tabla HistorialClinico -->
        <section class="medical-history">
            <h2 class="text-custom">Historial Médico</h2>
            <ul class="list-unstyled">
                <li class="bg-light p-3 mb-2 rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <!-- Información del historial -->
                        <div>
                            <dt class="btn btn-warning">ID historial: <?php echo htmlspecialchars($historial['id_historial_clinico']); ?></dt>
                            <dt>Fecha registro: <?php echo htmlspecialchars($historial['fecha_registro']); ?></dt>
                        </div>

                        
                        <div class="d-flex">
                            <!-- Botón Editar -->
                            
                                
                                <a type="submit" class="btn btn-primary" href="./editarClinicalHistory.php?id_historial_clinico=<?php echo htmlspecialchars($historial['id_historial_clinico']); ?>">Editar</a>
                            

                        </div>
                    </div>
                    <dt>Diagnóstico:</dt>
                    <p><?php echo htmlspecialchars($historial['diagnostico']); ?></p>
                    <dt>Tratamiento:</dt>
                    <p><?php echo htmlspecialchars($historial['tratamiento']); ?></p>
                    <dt>Procedimientos:</dt>
                    <p><?php echo htmlspecialchars($historial['procedimientos']); ?></p>
                    <dt>Observaciones Iniciales:</dt>
                    <p><?php echo htmlspecialchars($historial['observaciones']); ?></p>
                    <dt>Alergias:</dt>
                    <p><?php echo htmlspecialchars($historial['alergias']); ?></p>
                </li>
            </ul>
        </section>


        <!--  Sección 3: Observaciones previas, cargadas de la tabla de observaciones relacionada con el historial clínico (Pendiente de implementación)
        <section class="patient-observations">
            <table>
                <thead>
                    <tr>
                        <th>Cita:</th>
                        <th>Fecha:</th>
                        <th>Observacion</th>
                    </tr>
                </thead>
                <tbody>

                ////<?php foreach ($observaciones as $observacion): ?>
                    
                    ////<tr>
                        ////<td><?php echo htmlspecialchars($observacion->numero_documento); ?></td>
                        ////<td><?php echo htmlspecialchars($observacion->numero_documento); ?></td>
                        ////<td><?php echo htmlspecialchars($observacion->numero_documento); ?></td>
                    ////</tr>

                ////<?php endforeach; ?>*/
                </tbody>
            </table>
        </section> -->

    </main>

    <!-- Footer -->
    <?php include_once  '../../layouts/footer.php'; ?>

    
</body>

</html>
