<?php
require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

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
    <title>Registro de Usuario</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Coustard:wght@400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

        :root {
            --color-principal: #ff914d;
            --color-secundario: #6C5F5B;
            --color-complementario: #4F4A45;
            --negro: #151515;
            --white: #FFFFFF;
            --fuente-principal: "Roboto Mono", monospace;
            --small-font: 14px;
            --medium-font: 16px;
            --large-font: 18px;
        }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: var(--fuente-principal);
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--color-secundario); /* Puedes cambiar el color de fondo si lo prefieres */
        }

        .container-fluid {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color:var(--color-principal);
        }

        .form {
            background-color: var(--color-principal);
            padding: 20px;
            width: 1200px;
        }

        .card {
            max-width: 1200px;
            width: 100%;
            box-shadow: 10px 8px 16px var(--color-complementario);
            border-radius: 25px;
        }

        @media (max-width: 576px) {
            .bg-image {
                display: none;
            }
        }

        .register-link {
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row g-0">
            <!-- Registration Form -->
            <div class="col-lg-12 d-flex align-items-center justify-content-center form">
                <div class="card p-4">
                    <h2 class="text-center mb-4">Registro de Usuario</h2>
                    
                    <form method="post" action="/HealthConnection/root/src/controllers/crearPaciente.php">
                    <!-- Form fields -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="tipo_doc" class="form-label">Tipo de Documento:</label>
                                <select id="tipo_doc" name="tipo_doc" class="form-select" required>
                                    <option value="">Selecciona el tipo de Doc...</option>
                                    <option value="cc">Cédula de Ciudadanía</option>
                                    <option value="ti">Tarjeta de Identidad</option>
                                    <option value="passport">Pasaporte</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="numero_documento" class="form-label">Número de Documento:</label>
                                <input type="number" id="numero_documento" name="numero_documento" placeholder="escribe tu numero de identificacion" class="form-control" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="nombre" class="form-label">Nombres:</label>
                                <input type="text" id="nombre" name="nombre" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label for="apellido" class="form-label">Apellidos:</label>
                                <input type="text" id="apellido" name="apellido" class="form-control" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="fecha_de_nacimiento" class="form-label">Fecha de Nacimiento:</label>
                                <input type="date" id="fecha_de_nacimiento" name="fecha_de_nacimiento" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label for="genero" class="form-label">Género:</label>
                                <select id="genero" name="genero" class="form-select" required>
                                    <option value="">--Selecciona--</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="email" class="form-label">Correo:</label>
                                <input type="email" id="email" name="email" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label for="telefono" class="form-label">Número de Teléfono:</label>
                                <input type="number" id="telefono" name="telefono" class="form-control" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="direccion" class="form-label">Dirección:</label>
                                <input type="text" id="direccion" name="direccion" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label for="ciudad" class="form-label">Ciudad:</label>
                                <select id="ciudad" name="ciudad" class="form-select" required>
                                    <option value="">--Selecciona--</option>
                                    <?php foreach ($ciudades as $ciudad) : ?>
                                        <option value="<?= $ciudad['id_ciudad']; ?>"><?= $ciudad['nombre_ciudad']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="contraseña" class="form-label">Contraseña:</label>
                                <input type="password" id="contraseña" name="contraseña" class="form-control" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Registrar</button>
                    </form>
                    <p class="register-link">¿Ya estás registrado? <a href="./login.html">Iniciar Sesión</a></p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
