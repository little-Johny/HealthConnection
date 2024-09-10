<?php 
include_once '../../controllers/patientController/consultarPaciente.php'; 
include_once '../../controllers/doctorController/consultarDoctor.php'; 
include_once '../../controllers/administrativeController/consultarAdministrativo.php'; 
include_once '../../controllers/secretariesController/consultarSecretaria.php'; 
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
            <button class="btn btn-primary" onclick="showSection('doctores')">Doctores</button>
            <button class="btn btn-primary" onclick="showSection('Administrativos')">Administrativos</button>
            <button class="btn btn-primary" onclick="showSection('Secretaria')">Secretaria</button>
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
                                    <th>Plan Afiliacion</th>
                                    <th>Direccion</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tbody>
                                <?php foreach($paciente as $usuario): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($usuario->numero_documento); ?></td>
                                        <td><?php echo htmlspecialchars($usuario->tipo_doc); ?></td>
                                        <td><?php echo htmlspecialchars($usuario->nombre . ' ' . $usuario->apellido); ?></td>
                                        <td><?php echo htmlspecialchars($usuario->fecha_de_nacimiento); ?></td>
                                        <td><?php echo htmlspecialchars($usuario->genero); ?></td>
                                        <td><?php echo htmlspecialchars($usuario->telefono); ?></td>
                                        <td>
                                            <?php echo htmlspecialchars($usuario->plan_afiliacion ?? 'No afiliado'); ?>
                                        </td>
                                        <td>
                                            <?php echo htmlspecialchars($usuario->direccion_texto ?? 'Dirección no disponible'); ?>
                                        </td>
                                        <td>
                                        <?php echo htmlspecialchars($usuario->estado ?? 'Dirección no disponible'); ?>
                                        </td>

                                        <td class="actions">
                                            <a href="./historialSolicitudes.html" class="btn btn-sm btn-primary">Ver historial de solicitudes</a>
                                            <a href="./Historial clinico.html" class="btn btn-sm btn-secondary">Ver historial médico</a>
                                            <a href="./patients/editarPaciente.php?numero_documento=<?php echo htmlspecialchars($usuario->numero_documento); ?>" class="btn btn-primary">Editar Perfil</a>
                                            <a type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModal<?php echo htmlspecialchars($usuario->numero_documento); ?>">Eliminar</a>

                                        <!-- Modal Confirmación Eliminación -->
                                        <div class="modal fade" id="confirmModal<?php echo htmlspecialchars($usuario->numero_documento); ?>" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="confirmModalLabel">Confirmar Eliminación</h5>
                                                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        ¿Estás seguro de que deseas eliminar este usuario?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <form action="../../controllers/patientController/deletePaciente.php" method="POST">
                                                            <input type="hidden" name="numero_documento" value="<?php echo htmlspecialchars($usuario->numero_documento); ?>">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                            <button type="submit" class="btn btn-danger">Eliminar</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>


                            </tbody>
                        </table>
                    </div>
                    <div class="section-buttons">
                        <button onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/patients/registrarPaciente.php';" class="btn btn-sm btn-primary">Registrar Paciente</button>
                    </div>
                </div>
            </section>

            <!-- Sección Doctor -->
            <section id="doctores" class="content-section ">
                <div class="container mt-5">
                    <div class="title mb-4 text-center">
                        <h2>Doctores</h2>
                    </div>

                    <!-- Tabla de Usuarios -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Especialidad</th>
                                    <th>Género</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tbody>
                                <?php foreach($doctores as $doctor): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($doctor->id_doctor); ?></td>
                                        <td><?php echo htmlspecialchars($doctor->nombre . ' ' . $doctor->apellido); ?></td>
                                        <td><?php echo htmlspecialchars($doctor->nombre_especialidad); ?></td>
                                        <td><?php echo htmlspecialchars($doctor->genero); ?></td>
                                        <td><?php echo htmlspecialchars($doctor->telefono); ?></td>                                        

                                        <td class="actions">
                                            
                                            <a href="./Historial clinico.html" class="btn btn-sm btn-secondary">Ver agenda </a>
                                            <a href="./doctors/editarDoctor.php?id_doctor=<?php echo htmlspecialchars($doctor->id_doctor); ?>" class="btn btn-primary">Editar Perfil</a>
                                            <a type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModalDoctor<?php echo htmlspecialchars($doctor->id_doctor); ?>">Eliminar</a>

                                            <!-- Modal Confirmación Eliminación -->
                                            <div class="modal fade" id="confirmModalDoctor<?php echo htmlspecialchars($doctor->id_doctor); ?>" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabelDoctor" aria-hidden="true">
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="confirmModalLabelDoctor">Confirmar Eliminación</h5>
                                                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            ¿Estás seguro de que deseas eliminar este doctor?
                                                        </div>
                                                        <div class="modal-footer">
                                                            <form action="../../controllers/doctorController/deleteDoctor.php" method="POST">
                                                                <input type="hidden" name="id_doctor" value="<?php echo htmlspecialchars($doctor->id_doctor); ?>">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                                <button type="submit" class="btn btn-danger">Eliminar</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>


                            </tbody>
                        </table>
                    </div>
                    <div class="section-buttons">
                        <button onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/doctors/registrarDoctor.php';" class="btn btn-sm btn-primary">Registrar doctor</button>
                    </div>
                </div>
            </section>
            

            <!-- Sección Funcionarios -->
            <section id="Administrativos" class="content-section">
                <div class="container mt-5">
                    <div class="title mb-4 text-center">
                        <h2>Administrativos</h2>
                    </div>

                    <!-- Tabla de Funcionarios -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($administrativos as $administrativo): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($administrativo->id_Administrativos); ?></td>
                                    <td><?php echo htmlspecialchars($administrativo->nombre . ' ' . $administrativo->apellido); ?></td>
                                    <td><?php echo htmlspecialchars($administrativo->telefono); ?></td>
                                    <td><?php echo htmlspecialchars($administrativo->email); ?></td>
                                    <td class="actions">

                                            <a href="./administratives/editarAdministrativo.php?id_Administrativos=<?php echo htmlspecialchars($administrativo->id_Administrativos); ?>" class="btn btn-primary">Editar Perfil</a>
                                            
                                            <a type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModalAdministrativo<?php echo htmlspecialchars($administrativo->id_Administrativos); ?>">Eliminar</a>

                                        <!-- Modal Confirmación Eliminación -->
                                        <div class="modal fade" id="confirmModalAdministrativo<?php echo htmlspecialchars($administrativo->id_Administrativos); ?>" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabelDoctor" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="confirmModalLabelAdministrativo">Confirmar Eliminación</h5>
                                                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        ¿Estás seguro de que deseas eliminar este administrativo?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <form action="../../controllers/administrativeController/deleteAdministrativo.php" method="POST">
                                                            <input type="hidden" name="id_Administrativos" value="<?php echo htmlspecialchars($administrativo->id_Administrativos); ?>">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                            <button type="submit" class="btn btn-danger">Eliminar</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="section-buttons">
                        <button onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/administratives/registrarAdministrativo.php';" class="btn btn-sm btn-primary">Registrar Administrativo</button>
                    </div>
                </div>
            </section>
            
            <!-- Sección Secretaria -->
            <section id="Secretaria" class="content-section">
                <div class="container mt-5">
                    <div class="title mb-4 text-center">
                        <h2>Secretarias</h2>
                    </div>

                    <!-- Tabla de Secretarias -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($secretarias as $secretaria): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($secretaria->id_Secretaria); ?></td>
                                    <td><?php echo htmlspecialchars($secretaria->nombre . ' ' . $secretaria->apellido); ?></td>
                                    <td><?php echo htmlspecialchars($secretaria->telefono); ?></td>
                                    <td><?php echo htmlspecialchars($secretaria->email); ?></td>
                                    <td class="actions">

                                            <a href="./secretaries/editarSecretaria.php?id_Secretaria=<?php echo htmlspecialchars($secretaria->id_Secretaria); ?>" class="btn btn-primary">Editar Perfil</a>
                                            
                                            <a type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModalSecretaria<?php echo htmlspecialchars($secretaria->id_Secretaria); ?>">Eliminar</a>

                                        <!-- Modal Confirmación Eliminación -->
                                        <div class="modal fade" id="confirmModalSecretaria<?php echo htmlspecialchars($secretaria->id_Secretaria); ?>" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabelDoctor" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="confirmModalLabelSecretaria">Confirmar Eliminación</h5>
                                                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        ¿Estás seguro de que deseas eliminar este Secretaria?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <form action="../../controllers/secretariesController/deleteSecretaria.php" method="POST">
                                                            <input type="hidden" name="id_Secretaria" value="<?php echo htmlspecialchars($secretaria->id_Secretaria); ?>">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                            <button type="submit" class="btn btn-danger">Eliminar</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="section-buttons">
                        <button onclick="window.location.href='<?php echo $baseUrlSrc; ?>views/admin/secretaries/registrarSecretaria.php';" class="btn btn-sm btn-primary">Registrar secretaria</button>
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
