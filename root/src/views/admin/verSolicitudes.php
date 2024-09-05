<?php 
include_once '../../controllers/consultarCitas.php'; 
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
    
    <style>
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
        }

        body {
            font-family: var(--fuente-principal);            
            margin: 0;
            padding: 0;
        }

        .bg-body-secondary {
            margin-top: 100px;
        }  

        .container-record {
            width: 90%;
            max-width: 90%;
            padding: 20px;
            margin: 20px auto;
            background-color: var(--white);
            border: 1px solid var(--color-secundario);
            border-radius: 8px;
            box-shadow: 10px 8px 16px var(--color-complementario);
            flex-grow: 1;
        }

        .nav-menu {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 20px;
            gap: 10px;
        }

        .nav-menu button {
            flex: 1;
            background-color: var(--white);
            border: 1px solid #ccc;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s, border 0.3s;
        }

        .nav-menu button:hover {
            background-color: var(--color-principal);
            color: var(--white);
            border: 2px solid var(--color-principal);
        }

        .content-section {
            display: none;
            width: 100%;
        }

        .content-section.active {
            display: block;
        }

        .title {
            text-align: center;
            background-color: var(--color-principal);
            padding: 10px;
            border-radius: 8px;
            color: var(--white);
            font-size: var(--large-font);
            margin-bottom: 20px;
        }

        .primary-button {
            background-color: var(--white);
            color: var(--color-principal);
            border: 2px solid var(--color-principal);
            font-size: var(--large-font);
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        .primary-button:hover {
            background-color: var(--color-principal);
            color: var(--white);
        }

        .appointment-card, .payment-card {
            border: 2px solid var(--color-principal);
            padding: 20px;
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            word-wrap: break-word;
        }

        .actions {
            display: flex;
            justify-content: space-around;
        }

        .search-bar {
            margin: 20px 0;
        }

        /* Hacer que la tabla sea responsive */
        .table-responsive {
            overflow-x: auto;
        }

        @media (max-width: 768px) {
            .nav-menu {
                flex-direction: column;
            }
            .container-record {
                max-width: 100%;
            }
        }
    </style>
</head>

<body class="bg-body-secondary">

    <!-- Navbar -->
    <?php include $baseUrlSrc . 'views/layouts/navbar.php'; ?>

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

                                        <a class="btn btn-primary" href="editarCita.php?id_cita=<?php echo htmlspecialchars($cita->id_cita); ?>">Editar</a>
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
                                                        <form action="../../controllers/deleteCita.php" method="POST">
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
        <?php include $baseUrlSrcFooter . 'views/layouts/footer.php'; ?>

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
