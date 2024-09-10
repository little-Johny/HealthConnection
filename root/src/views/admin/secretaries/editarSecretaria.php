<?php
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';

if (!isset($_GET["id_Secretaria"]) || empty($_GET["id_Secretaria"])) {
    echo "ID de Secretaria no proporcionado.";
    exit();
}

$id_Secretaria = $_GET["id_Secretaria"];

// Preparar y ejecutar la consulta para obtener los datos del administrativo
$stmt = $database->prepare("SELECT s.id_Secretaria, s.nombre, s.apellido, s.tipo_documento, s.numero_documento, s.telefono, s.email, s.direccion, d.direccion AS direccion_completa, d.id_ciudad, c.nombre_ciudad AS ciudad_nombre 
    FROM Secretaria s
    JOIN Direccion d ON s.direccion = d.id_direccion
    JOIN Ciudad c ON d.id_ciudad = c.id_ciudad
    WHERE s.id_Secretaria = ?");

$stmt->execute([$id_Secretaria]);
$secretaria = $stmt->fetch(PDO::FETCH_ASSOC);

if ($secretaria === false) {
    echo "¡No existe ningún administrativo con ese ID!";
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
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Administrativo</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        /* Estilos personalizados */
        body {
            background-image: url('../../../../public/images/BackgroundHC.jpg');
            background-size: cover;
            font-family: "Roboto Mono", monospace;
        }
        .container {
            margin-top: 50px;
            padding: 15px;
        }
        .card {
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .card-header {
            background-color: #ff914d;
            color: white;
            border-radius: 15px 15px 0 0;
            padding: 15px;
        }
        .form-select,
        .form-control {
            width: 90%;
            padding: 10px;
            border: 2px solid #ff914d;
            border-radius: 5px;
            font-weight: 600;
        }
        .btn-primary {
            background-color: #007bff;
            border: none;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Editar Secretaria <?php echo htmlspecialchars($secretaria['id_Secretaria']); ?></h4>
                    </div>
                    <div class="card-body">
                        <form method="post" action="/HealthConnection/root/src/controllers/secretariesController/updateSecretaria.php" enctype="multipart/form-data">
                            <input type="hidden" name="id_Secretaria" value="<?php echo htmlspecialchars($secretaria['id_Secretaria']); ?>">

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="tipo_doc" class="form-label">Tipo de Documento:</label>
                                    <select id="tipo_doc" name="tipo_doc" class="form-select">
                                        <option value="">Selecciona el tipo de Doc...</option>
                                        <option value="cc" <?php echo ($secretaria['tipo_documento'] === 'cc') ? 'selected' : ''; ?>>Cédula de Ciudadanía</option>
                                        <option value="ti" <?php echo ($secretaria['tipo_documento'] === 'ti') ? 'selected' : ''; ?>>Tarjeta de Identidad</option>
                                        <option value="passport" <?php echo ($secretaria['tipo_documento'] === 'passport') ? 'selected' : ''; ?>>Pasaporte</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="numero_documento" class="form-label">Número de Documento:</label>
                                    <input type="number" id="numero_documento" name="numero_documento" class="form-control" value="<?php echo htmlspecialchars($secretaria['numero_documento']); ?>">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="nombre" class="form-label">Nombres:</label>
                                    <input type="text" id="nombre" name="nombre" class="form-control" value="<?php echo htmlspecialchars($secretaria['nombre']); ?>">
                                </div>
                                <div class="col-md-6">
                                    <label for="apellido" class="form-label">Apellidos:</label>
                                    <input type="text" id="apellido" name="apellido" class="form-control" value="<?php echo htmlspecialchars($secretaria['apellido']); ?>">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="email" class="form-label">Correo:</label>
                                    <input type="email" id="email" name="email" class="form-control" value="<?php echo htmlspecialchars($secretaria['email']); ?>">
                                </div>
                                <div class="col-md-6">
                                    <label for="telefono" class="form-label">Número de Teléfono:</label>
                                    <input type="number" id="telefono" name="telefono" class="form-control" value="<?php echo htmlspecialchars($secretaria['telefono']); ?>">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="direccion" class="form-label">Dirección:</label>
                                    <input type="text" id="direccion" name="direccion" class="form-control" value="<?php echo htmlspecialchars($secretaria['direccion_completa']); ?>">
                                </div>

                                <div class="col-md-6">
                                    <label for="ciudad" class="form-label">Ciudad:</label>
                                    <select id="ciudad" name="ciudad" class="form-select">
                                        <?php foreach ($ciudades as $ciudad): ?>
                                            <option value="<?php echo $ciudad['id_ciudad']; ?>" <?php echo ($ciudad['id_ciudad'] == $secretaria['id_ciudad']) ? 'selected' : ''; ?>>
                                                <?php echo htmlspecialchars($ciudad['nombre_ciudad']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Actualizar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
