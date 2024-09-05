<?php 
include_once '../../controllers/consultarRegistros.php'; 
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = 'C:/xampp/htdocs/HealthConnection/root/src/'; // Ruta base absoluta para archivos PHP
$baseUrlSrcFooter = 'C:/xampp/htdocs/HealthConnection/root/src/';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Connection</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
    <!-- ! Importación local de logo de ventana-->
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic; ?>images/tab_icon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/admin/verRegistros.css">

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <style>
        /* Estilo para asegurar que la tabla se mantenga dentro del contenedor */
        .table-responsive {
            overflow-x: auto;
        }
        /* Estilo para limitar el ancho de la tabla en pantallas pequeñas */
        .table {
            width: 100%;
        }
        /* Centrar verticalmente el contenido de la tabla */
        .table td, .table th {
            vertical-align: middle;
        }
        /* Estilo para los botones en vista normal */
        .nav-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px; /* Espacio entre botones */
        }
        .nav-buttons .btn {
            flex: 1 1 auto;
        }
        /* Estilo para los botones dentro de la columna de acciones */
        .actions {
            margin: 0;
            display: flex;
            flex-direction: column; /* Apilar los botones verticalmente */
            gap: 5px; /* Espacio entre botones */
        }
        /* Estilo para centrar el botón de registrar */
        .section-buttons {
            display: flex;
            justify-content: center; /* Centra horizontalmente el botón */
            margin-top: 20px;
        }
        .section-buttons .btn {
            max-width: 200px; /* Ajusta el tamaño máximo del botón */
        }
    </style>
</head>

<body class="bg-body-secondary">
    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>

    <div class="container container-record">
        <!-- Menú de navegación -->
        <nav class="nav-buttons mb-4">
            <button class="btn btn-primary" onclick="showSection('usuarios')">Usuarios</button>
            <button class="btn btn-primary" onclick="showSection('funcionarios')">Funcionarios</button>
        </nav>

        <!-- Secciones de contenido -->
        <main>
            <div class="row search-bar mb-4">
                <div class="col-12">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Buscar por nombre del paciente, id servicio..." id="searchInput">
                        <button class="btn btn-primary" type="button">Buscar</button>
                    </div>
                </div>
            </div>

            <!-- Sección Usuarios -->
            <section id="usuarios" class="content-section active">
                <div class="container mt-5">
                    <div class="title mb-4 text-center">
                        <h2>Usuarios</h2>
                    </div>

                    <!-- Tabla de Usuarios -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Documento</th>
                                    <th>Tipo de Documento</th>
                                    <th>Nombre Completo</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Género</th>
                                    <th>Teléfono</th>
                                    <th>ID Afiliación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($paciente as $usuario): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($usuario->numero_documento); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->tipo_doc); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->nombre . ' ' . $usuario->apellido); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->fecha_de_nacimiento); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->genero); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->telefono); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->id_afiliacion); ?></td>
                                    <td class="actions">
                                        <a href="./historialSolicitudes.html" class="btn btn-sm btn-primary">Ver historial de solicitudes</a>
                                        <a href="./Historial clinico.html" class="btn btn-sm btn-secondary">Ver historial médico</a>
                                        <a href="./Update-Profile.html" class="btn btn-sm btn-success">Editar Perfil</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="section-buttons">
                        <button onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/registrarPaciente.php';" class="btn btn-sm btn-primary">Registrar nuevo paciente</button>
                    </div>
                </div>
            </section>

            <!-- Sección Funcionarios -->
            <section id="funcionarios" class="content-section">
                <div class="container mt-5">
                    <div class="title mb-4 text-center">
                        <h2>Funcionarios</h2>
                    </div>

                    <!-- Tabla de Funcionarios -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Documento</th>
                                    <th>Tipo de Documento</th>
                                    <th>Nombre Completo</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Género</th>
                                    <th>Teléfono</th>
                                    <th>ID Afiliación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($paciente as $usuario): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($usuario->numero_documento); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->tipo_doc); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->nombre . ' ' . $usuario->apellido); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->fecha_de_nacimiento); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->genero); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->telefono); ?></td>
                                    <td><?php echo htmlspecialchars($usuario->id_afiliacion); ?></td>
                                    <td class="actions">
                                        <a href="./historialSolicitudes.html" class="btn btn-sm btn-primary">Ver historial de solicitudes</a>
                                        <a href="./Historial clinico.html" class="btn btn-sm btn-secondary">Ver historial médico</a>
                                        <a href="./Update-Profile.html" class="btn btn-sm btn-success">Editar Perfil</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="section-buttons">
                        <button class="btn btn-sm btn-primary "><a href="./registrarfuncionario.html" class="text-light">Registrar nuevo funcionario</a></button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter.'views/layouts/footer.php'; ?>

    <script>
        function showSection(id) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(id).classList.add('active');
        }

        document.getElementById('searchInput').addEventListener('input', function () {
            const searchValue = this.value.toLowerCase();
            document.querySelectorAll('.content-section.active .table tbody tr').forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(searchValue) ? '' : 'none';
            });
        });
    </script>
</body>
</html>
