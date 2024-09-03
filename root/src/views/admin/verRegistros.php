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
</head>

<body class="bg-body-secondary">
    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>

    <div class="container container-record">
        <!-- Menú de navegación -->
        <nav class="d-flex flex-wrap justify-content-between mb-4">
            <button class="btn" onclick="showSection('usuarios')">Usuarios</button>
            <button class="btn" onclick="showSection('funcionarios')">Funcionarios</button>
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
                                    <td>
                                        <a href="./historialSolicitudes.html" class="btn btn-sm btn-primary">Ver historial de solicitudes</a>
                                        <a href="./Historial clinico.html" class="btn btn-sm btn-secondary">Ver historial médico</a>
                                        <a href="./Update-Profile.html" class="btn btn-sm btn-success">Editar Perfil</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <button  onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/registrarPaciente.php';" class="btn btn-sm btn-primary">Registrar nuevo paciente</button>
                </div>
            </section>

            <!-- Sección Funcionarios -->
            <section id="funcionarios" class="content-section">
                <div class="title">
                    <h2>Funcionarios</h2>
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
                                    <td>
                                        <a href="./historialSolicitudes.html" class="btn btn-sm btn-primary">Ver historial de solicitudes</a>
                                        <a href="./Historial clinico.html" class="btn btn-sm btn-secondary">Ver historial médico</a>
                                        <a href="./Update-Profile.html" class="btn btn-sm btn-success">Editar Perfil</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                </div>


                <button class="btn btn-sm btn-primary "><a href="./registrarfuncionario.html " >Registrar nuevo funcionario</a></button>
            </section>
        </main>
    </div>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter.'views\layouts\footer.php'; ?>

    <script>
        

        function showSection(id) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(id).classList.add('active');
        }

        document.getElementById('searchInput').addEventListener('input', function () {
            const searchValue = this.value.toLowerCase();
            document.querySelectorAll('.content-section.active article').forEach(article => {
                const text = article.innerText.toLowerCase();
                article.style.display = text.includes(searchValue) ? '' : 'none';
            });
        });
    </script>
</body>

</html>
