<?php 

include_once '../../controllers/consultarCitas.php'; 
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
    
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic;?>images/tab_icon.png" type="image/x-icon">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
    
    <style>
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
            background-color: var(--gris-fondo);
            margin: 0;
            padding: 0;
        }

        .container-record {
            max-width: 80%;
            padding: 20px;
            height: 1000px;
            margin: 20px auto;
            background-color: var(--white);
            border: 1px solid var(--color-secundario);
            border-radius: 8px;
            box-shadow: 10px 8px 16px var(--color-complementario);
        }

        .logo img {
            width: 50px;
            height: 50px;
        }

        .user-icon img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .nav-menu {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 20px;
            padding: 10px;
            gap: 10px;
        }

        .nav-menu button {
            flex: 1;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }

        .nav-menu button:hover {
            background-color: var(--white);
            color: var(--color-principal);
            border: 2px solid var(--color-principal);
        }

        .main-content {
            display: flex;
            flex-direction: column;
        }

        .content-section {
            display: none;
            width: 100%;
        }

        .content-section.active {
            display: block;
        }

        .title {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--color-principal);
            margin-bottom: 20px;
            padding: 10px;
            border-radius: 8px;
            color: var(--white);
            font-size: var(--large-font);
            text-align: center;
        }

        .appointment-card {
            display: flex;
            flex-direction: column;
            border: 2px solid var(--color-principal);
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            word-wrap: break-word;
        }

        .appointment-card p {
            margin: 10px 0;
        }

        .primary-button {
            background-color: var(--white);
            color: var(--color-principal);
            border: 2px solid var(--color-principal);
            font-size: var(--large-font);
            border-radius: 8px;
            cursor: pointer;
        }

        .primary-button a {
            color: var(--color-principal);
            text-decoration: none;
        }
        
        .primary-button a:hover {
            color: var(--white);
        }

        .primary-button:hover {
            background-color: var(--color-principal);
            color: var(--white);
        }

        .payment-cards-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .payment-card {
            flex: 1 1 250px;
            border: 2px solid var(--color-principal);
            border-radius: 8px;
            background: white;
            margin-bottom: 20px;
            padding: 15px;
            word-wrap: break-word;
        }

        .payment-card p {
            margin-left: 10px;
        }

        .delete {
            background: red;
            border-radius: 5px;
            border: 2px solid black;
            margin-bottom: 5px;
        }

        .edit {
            background: green;
            border-radius: 5px;
            border: 2px solid black;
            margin-bottom: 5px;
        }

        .actions {
            display: flex;
            justify-content: space-around;
        }

        .search-section {
            margin: 20px;
            max-width: 100%;
            padding: 10px;
            border: 1px solid var(--color-principal);
            border-radius: 8px;
            background-color: var(--white);
        }

        #search-input {
            width: 90%;
            padding: 10px;
            border: 1px solid var(--color-secundario);
            border-radius: 4px;
            margin-bottom: 10px;
            font-size: var(--medium-font);
        }

        .bg-body-secondary {
            margin-top: 140px;
        }

        
        @media (max-width: 768px) {
            .nav-menu {
                flex-direction: column;
            }
            
            .appointment-card, .payment-card {
                width: 100%; /* Asegura que las tarjetas no se desborden */
            }

            .container-record {
                max-width: 100%;
                padding: 20px;
                height: auto; /* Cambiado para permitir que el contenedor se ajuste en altura según el contenido */
                margin: 20px auto;
                background-color: var(--white);
                border: 1px solid var(--color-secundario);
                border-radius: 8px;
                box-shadow: 10px 8px 16px var(--color-complementario);
                overflow-x: auto; /* Agrega scroll horizontal si el contenido se desborda */
            }
            
            .main-content {
                display: flex;
                flex-direction: column;
                max-width: 100%; /* Asegura que el contenedor principal no se desborde */
            }
            
            .content-section {
                width: 100%; /* Asegura que cada sección ocupe el 100% del contenedor principal */
                box-sizing: border-box; /* Incluye padding y border en el cálculo del ancho total */
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
                                <td>
                                    <!-- Botones para asignar o negar cita -->
                                    <button class="btn btn-success" data-bs-toggle="collapse" data-bs-target="#success-<?php echo htmlspecialchars($cita['id_cita']); ?>" aria-expanded="false" aria-controls="success-<?php echo htmlspecialchars($cita['id_cita']); ?>">
                                        Asignar cita
                                    </button>

                                    <div class="collapse mt-2" id="success-<?php echo htmlspecialchars($cita['id_cita']); ?>">
                                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                                            Cita asignada
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>

                                    <button class="btn btn-danger" data-bs-toggle="collapse" data-bs-target="#denied-<?php echo htmlspecialchars($cita['id_cita']); ?>" aria-expanded="false" aria-controls="denied-<?php echo htmlspecialchars($cita['id_cita']); ?>">
                                        Negar cita
                                    </button>

                                    <div class="collapse mt-2" id="denied-<?php echo htmlspecialchars($cita['id_cita']); ?>">
                                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                            
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">Cita denegada</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                

            <!-- Sección Exámenes -->
            <section id="examenes" class="content-section">
                <header class="title">
                    <h2>Exámenes</h2>
                </header>
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Examen: Hemograma Completo</p>
                            <p>Fecha: 22/06/2024</p>
                            <p>Hora: 08:30 AM</p>
                            <p>Lugar: Centro de atención Chapinero</p>
                            <button class="primary-button mb-2"><a href="./resultados.html">Ver resultados</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Examen: Hemograma Completo</p>
                            <p>Fecha: 22/06/2024</p>
                            <p>Hora: 08:30 AM</p>
                            <p>Lugar: Centro de atención Chapinero</p>
                            <button class="primary-button mb-2"><a href="./resultados.html">Ver resultados</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Examen: Hemograma Completo</p>
                            <p>Fecha: 22/06/2024</p>
                            <p>Hora: 08:30 AM</p>
                            <p>Lugar: Centro de atención Chapinero</p>
                            <button class="primary-button mb-2"><a href="./resultados.html">Ver resultados</a></button>
                        </article>
                    </div>
                    
                </div>
            </section>

            <!-- Sección Autorizaciones Médicas -->
            <section id="autorizaciones-medicas" class="content-section">
                <header class="title">
                    <h2>Autorizaciones Médicas</h2>
                </header>
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Paciente: Laura Rivera</p>
                            <p>Autorización: Aprobada</p>
                            <p>Fecha: 19/06/2024</p>
                            <button class="primary-button mb-2"><a href="./VerifyAutorization.html">Ver Autorización</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Paciente: Laura Rivera</p>
                            <p>Autorización: Aprobada</p>
                            <p>Fecha: 19/06/2024</p>
                            <button class="primary-button mb-2"><a href="./VerifyAutorization.html">Ver Autorización</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Paciente: Laura Rivera</p>
                            <p>Autorización: Aprobada</p>
                            <p>Fecha: 19/06/2024</p>
                            <button class="primary-button mb-2"><a href="./VerifyAutorization.html">Ver Autorización</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="appointment-card">
                            <p>Paciente: Laura Rivera</p>
                            <p>Autorización: Aprobada</p>
                            <p>Fecha: 19/06/2024</p>
                            <!-- *Boton de asignar cita-->
                            <button class="primary-button my-1" data-bs-toggle="collapse" data-bs-target="#success" aria-expanded="false" aria-controls="miAlerta">
                                Asignar Autorizacion
                            </button>
                    
                            <!-- Alerta oculta -->
                            <div class="collapse mt-3" id="success">
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Autorización asignada
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                            
                            <!--!Boton de negar cita  -->
                            <button class=" primary-button my-1" data-bs-toggle="collapse" data-bs-target="#denied" aria-expanded="false" aria-controls="miAlerta">
                                Negar Autorización
                            </button>
                    
                            <!-- Alerta oculta -->
                            <div class="collapse mt-3" id="denied">
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    Autorización denegada
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </article>
                    </div>
                    <button class="primary-button mb-2">
                        <a href="./newAutorization.html" class="text-decoration-none">Crear Autorizacion</a>
                    </button>
                </div>
            </section>

            <!-- Sección Copagos -->
            <section id="copagos" class="content-section">
                <header class="title">
                    <h2>Copagos</h2>
                </header>
                <div class="payment-cards-container">
                    <div class="payment-card">
                        <p>Paciente: Maria Gomez</p>
                        <p>Monto: $100,000</p>
                        <p>Fecha: 10/06/2024</p>
                        <p>Estado: Pendiente</p>
                        <div class="actions">
                            <button class="primary-button mb-2"><a href="./modifyPagos.html">Ver detalles</a></button>
                        </div>
                    </div>
                    <div class="payment-card">
                        <p>Paciente: Carlos Rodriguez</p>
                        <p>Monto: $50,000</p>
                        <p>Fecha: 15/06/2024</p>
                        <p>Estado: Pagado</p>
                        <div class="actions">
                            <button class="primary-button mb-2"><a href="./modifyPagos.html">Ver detalles</a></button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección Afiliaciones -->
            <section id="mis-afiliaciones" class="content-section">
                <header class="title">
                    <h2> Afiliaciones</h2>
                </header>
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="payment-card">
                            <p>Paciente: Marta Gomez</p>
                            <p>Afiliación: Activa</p>
                            <p>Fecha: 17/06/2024</p>
                            <p>Tipo: Medicina prepagada</p>
                            <button class="primary-button mb-2"><a href="./modifyAfiliacion.html">Ver detalles</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="payment-card">
                            <p>Paciente: Marta Gomez</p>
                            <p>Afiliación: Activa</p>
                            <p>Fecha: 17/06/2024</p>
                            <p>Tipo: Medicina prepagada</p>
                            <button class="primary-button mb-2"><a href="./modifyAfiliacion.html">Ver detalles</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="payment-card">
                            <p>Paciente: Marta Gomez</p>
                            <p>Afiliación: Activa</p>
                            <p>Fecha: 17/06/2024</p>
                            <p>Tipo: Medicina prepagada</p>
                            <button class="primary-button mb-2"><a href="./modifyAfiliacion.html">Ver detalles</a></button>
                        </article>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <article class="payment-card">
                            <p>Paciente: Marta Gomez</p>
                            <p>Afiliación: Activa</p>
                            <p>Fecha: 17/06/2024</p>
                            <p>Tipo: Medicina prepagada</p>
                            <button class="primary-button mb-2"><a href="./modifyAfiliacion.html">Ver detalles</a></button>
                        </article>
                    </div>
                    
                </div>
            </section>
        </section>
    </section>
        <!-- Footer -->
        <?php include $baseUrlSrcFooter . 'views/layouts/footer.php'; ?>


    

    <script>
        function showSection(sectionId) {
            // Ocultar todas las secciones
            var sections = document.querySelectorAll('.content-section');
            sections.forEach(function(section) {
                section.classList.remove('active');
            });

            // Mostrar la sección seleccionada
            var activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.classList.add('active');
            }
        }
        
    </script>
</body>
</html>
