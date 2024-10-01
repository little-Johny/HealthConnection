<?php
require_once 'C:/xampp/htdocs/HealthConnection/root/config/databaseConexion.php';


//! Obtener las ciudades existentes desde la base de datos para poblar el campo select de ciudad
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
        body {
            background-image:url('../../../../public/images/BackgroundHC.jpg');
            background-repeat:none;
            background-size:cover;
            font-family: var(--fuente-principal);
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
            background-color: var(--color-principal);
            color: #fff;
            border-bottom: none;
            border-radius: 15px 15px 0 0;
            padding: 15px;
        }
        .form-label {
            font-weight: bold;
        }
        .profile-image-container {
            position: relative;
            width: 100%;
            padding-top: 100%; /* Aspect Ratio 1:1 */
            border: 2px solid #ced4da;
            border-radius: 5px;
            overflow: hidden;
            background-color: #e9ecef;
            text-align: center;
        }
        .profile-image-container img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .custom-file-input-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: 100%;
            padding: 0;
            border: 1px solid #ced4da;
            border-radius: 5px;
            background-color: #e9ecef;
            text-align: center;
        }
        .custom-file-input-wrapper input[type="file"] {
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
        .custom-file-input-wrapper label {
            display: block;
            padding: 10px;
            cursor: pointer;
            background-color: #007bff;
            color: #fff;
            border-radius: 5px;
            text-align: center;
        }
        .custom-file-input-wrapper label:hover {
            background-color: #0056b3;
        }
        .form-select,
        .form-control{
            width: 90%;
            padding: 10px;
            border: 2px solid var(--color-principal);
            border-radius: 5px;
            font-family: var(--fuente-principal);
            font-weight: 600;
        }
        .custom-file-input {
            cursor: pointer;
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
                        <h4>Registro de Usuario</h4>
                    </div>
                    <div class="card-body">
                        <form method="post" action="/HealthConnection/root/src/controllers/patientController/crearPaciente.php" enctype="multipart/form-data">

                            <div class="row mb-3 d-flex justify-content-lg-center ">
                                <div class="col-md-6 text-center">
                                    <p for="foto_perfil" class="form-label">Foto de Perfil (opcional):</p>
                                    <div class="profile-image-container">
                                        <img id="previewImage" src="" alt="Vista previa" style="display:none;">
                                        <div class="custom-file-input-wrapper">
                                            <label for="foto_perfil">Seleccionar foto</label>
                                            <input type="file" id="foto_perfil" name="foto_perfil" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>

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

                                <div class="col-md-6 align-self-end ">
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
                                    <input type="date" id="fecha_de_nacimiento" name="fecha_de_nacimiento" class="form-control" required max="<?= date('Y-m-d')?>">
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
                                    <label for="contraseña" class="form-label">contraseña:</label>
                                    <input type="password" id="contraseña" name="contraseña" class="form-control" placeholder="crea tu contraseña">
                                </div>

                                <div class="col-md-6">
                                    <label for="contraseña-confirm" class="form-label">confirmacion de contraseña:</label>
                                    <input type="password" id="contraseña-confirm" name="contraseña-confirm" class="form-control" placeholder="confirma tu contraseña">
                                </div>

                            </div>

                            <button type="submit" class="btn btn-primary w-100">Registrar</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('foto_perfil').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const previewImage = document.getElementById('previewImage');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '';
                previewImage.style.display = 'none';
            }
        });

        document.getElementById('registrationForm').addEventListener('submit', function(event) {
            const password = document.getElementById('contraseña').value;
            const passwordConfirm = document.getElementById('contraseña-confirm').value;
            const errorElement = document.getElementById('contraseña-error');

            if (password !== passwordConfirm) {
                errorElement.style.display = 'block';
                event.preventDefault(); // Evita el envío del formulario
            } else {
                errorElement.style.display = 'none';
            }
        });
    </script>
</body>
</html>
