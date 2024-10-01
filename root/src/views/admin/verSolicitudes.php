<?php 
include_once '../../controllers/appointmentController/consultarCitas.php'; 
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = 'C:/xampp/htdocs/HealthConnection/root/src/';
$baseUrlSrcFooter = 'C:/xampp/htdocs/HealthConnection/root/src/';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Connection</title>
    
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic;?>images/tab_icon.png" type="image/x-icon">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../../../public/css/admin/verSolicitudes.css">
    
</head>

<body class="bg-body-secondary">

    <!-- Navbar -->
    <?php include  '../../views/layouts/navbar.php'; ?>

    <main class="container-record">
        <!-- Menú de navegación -->
        <nav class="nav-menu">
            <button class="btn btn-outline-primary" onclick="showSection('citas')">Citas</button>
            <button class="btn btn-outline-primary" onclick="showSection('examenes')">Exámenes</button>
            <button class="btn btn-outline-primary" onclick="showSection('autorizaciones-medicas')">Autorizaciones Médicas</button>
            <button class="btn btn-outline-primary" onclick="showSection('copagos')">Copagos</button>
            <button class="btn btn-outline-primary" onclick="showSection('mis-afiliaciones')">Afiliaciones</button>
        </nav>

        <!-- Secciones de contenido -->
        <section class="main-content">
            <div class="row search-bar mb-2">
                <div class="col-12">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Buscar por nombre del paciente, id servicio..." id="searchInput">
                        <button class="btn btn-primary" type="button">Buscar</button>
                    </div>
                </div>
            </div>

            <!-- Sección Citas -->
            <section id="citas" class="content-section active">
                <header class="title">
                    <h2>Citas</h2>
                </header>
                <div class="container mt-5">
                    <h2 class="mb-4">Lista de Citas</h2>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID Cita</th>
                                    <th>Paciente</th>
                                    <th>Especialidad</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($citas as $cita): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($cita->id_cita); ?></td>
                                    <td><?php echo htmlspecialchars($cita->paciente); ?></td>
                                    <td><?php echo htmlspecialchars($cita->especialidad); ?></td>
                                    <td><?php echo htmlspecialchars($cita->fecha); ?></td>
                                    <td><?php echo htmlspecialchars($cita->hora); ?></td> 
                                    <td class="actions">
                                        <button class="btn btn-success" data-bs-toggle="collapse" data-bs-target="#success-<?php echo htmlspecialchars($cita->id_cita); ?>" aria-expanded="false" aria-controls="success-<?php echo htmlspecialchars($cita->id_cita); ?>">
                                            Asignar cita
                                        </button>

                                        <div class="collapse mt-2" id="success-<?php echo htmlspecialchars($cita->id_cita); ?>">
                                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                                Cita asignada
                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div>

                                        <a class="btn btn-primary" href="./appointment/editarCita.php?id_cita=<?php echo htmlspecialchars($cita->id_cita); ?>">Editar</a>
                                        <a type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModal<?php echo htmlspecialchars($cita->id_cita); ?>">Eliminar</a>

                                        <!-- Modal Confirmación Eliminación -->
                                        <div class="modal fade" id="confirmModal<?php echo htmlspecialchars($cita->id_cita); ?>" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="confirmModalLabel">Confirmar Eliminación</h5>
                                                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        ¿Estás seguro de que deseas eliminar esta cita?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <form action="../../controllers/appointmentController/deleteCita.php" method="POST">
                                                            <input type="hidden" name="id_cita" value="<?php echo htmlspecialchars($cita->id_cita); ?>">
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
                </div>
            </section>

            <!-- Otras secciones -->
            <section id="examenes" class="content-section">
                <header class="title">
                    <h2>Exámenes</h2>
                </header>
                <p>Aquí se mostrarán los detalles de los exámenes.</p>
            </section>
            <section id="autorizaciones-medicas" class="content-section">
                <header class="title">
                    <h2>Autorizaciones Médicas</h2>
                </header>
                <p>Aquí se mostrarán los detalles de las autorizaciones médicas.</p>
            </section>
            <section id="copagos" class="content-section">
                <header class="title">
                    <h2>Copagos</h2>
                </header>
                <p>Aquí se mostrarán los detalles de los copagos.</p>
            </section>
            <section id="mis-afiliaciones" class="content-section">
                <header class="title">
                    <h2>Mis Afiliaciones</h2>
                </header>
                <p>Aquí se mostrarán los detalles de las afiliaciones.</p>
            </section>
        </main>

        <!-- Footer -->
        <?php include_once  '../../views/layouts/footer.php'; ?>

    <script>
        function showSection(sectionId) {
            var sections = document.querySelectorAll('.content-section');
            sections.forEach(function(section) {
                if (section.id === sectionId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        }
    </script>
</body>

</html>
