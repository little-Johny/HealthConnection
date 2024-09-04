<?php 
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = 'C:/xampp/htdocs/HealthConnection/root/src/'; // Ruta base absoluta para archivos PHP
$baseUrlSrcFooter = 'C:/xampp/htdocs/HealthConnection/root/src/';

?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Connection - Clínica Privada</title>
    <!-- !Importación de estilos con Bootstrap a través de CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- ! Importacion local de logo de ventana-->
    <link rel="shortcut icon" href="../public/images/tab_icon.png" type="image/x-icon">
    <!--!Estilos locales -->
    <link rel="stylesheet" href="../public/css/landingPage.css">
    <!-- !Estilos locales del footer -->
    <link rel="stylesheet" href="../public/css/layouts/footer.css">
</head>

<body class="bg-body-secondary ">
    <!-- ! Barra de Navegación -->
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid px-5">
            <a class="navbar-brand" href="#" style="color:white">Health Connection</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#about">Nosotros</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#services">Servicios</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#team">Equipo Médico</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contact">Contacto</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- ! Encabezado -->
    <header>
        <div class="hero">
            <h1>Bienvenido a Health Connection</h1>
            <p>Tu salud, nuestra prioridad</p>
            <a href="<?php echo $baseUrlPublic?>index.php" class="btn btn-primary ">Ingresar</a>
        </div>
    </header>

    <!-- ! Sección de Nosotros -->
    <section id="about" class="about">
        <div class="container">
            <h2>Sobre Nosotros</h2>
            <p>En Health Connection, somos una clínica privada dedicada a brindar servicios médicos de alta calidad con un
                enfoque en la atención personalizada y el bienestar de nuestros pacientes.</p>
        </div>
    </section>

    <!--  ! Sección de Servicios -->
    <section id="services" class="full-height-container">
        <div class="container">
            <h2 class="text-white mb-5">Nuestros Servicios</h2>
            <div class="card-container">
                <div class="row">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Consulta Médica</h5>
                            <p class="card-text">Ofrecemos consultas médicas con especialistas en diversas áreas, garantizando un diagnóstico preciso y un tratamiento adecuado.</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Exámenes de Laboratorio</h5>
                            <p class="card-text">Realiza tus exámenes de laboratorio con nosotros, contamos con tecnología avanzada para obtener resultados confiables y rápidos.</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Afiliaciones</h5>
                            <p class="card-text">Nuestros planes de afiliación ajustables a cualquier tipo de necesidad.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- !  Sección de Equipo Médico -->
    <section id="team" class="team text-center">
        <div class="container">
            <h2 class="mb-5">Nuestro Equipo Médico</h2>
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="team-member">
                        <img src="../public/images/Doctor.png" alt="Doctor 1" class="img-fluid mb-3">
                        <h3>Dr. Juan Pérez</h3>
                        <p>Cardiólogo</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="team-member">
                        <img src="../public/images/Doctor.png" alt="Doctor 2" class="img-fluid mb-3">
                        <h3>Dra. María López</h3>
                        <p>Dermatóloga</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="team-member">
                        <img src="../public/images/Doctor.png" alt="Doctor 3" class="img-fluid mb-3">
                        <h3>Dr. Pedro Gómez</h3>
                        <p>Cirujano</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!--  ! Sección de Contacto -->
    <section id="contact" class="contact text-center">
        <div class="container">
            <h2>Contacto</h2>
            <p>¿Tienes alguna pregunta o necesitas más información? Contáctanos hoy mismo.</p>
            <a href="mailto:info@healthconnection.com" class="btn btn-primary">Enviar un Correo</a>
        </div>
    </section>

    <!-- Footer -->
    <?php include $baseUrlSrcFooter . 'views/layouts/footer.php'; ?>

    <!-- ! Importación de paquete de funcionalidades para estilos de Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>
