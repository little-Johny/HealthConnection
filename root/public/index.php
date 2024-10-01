<?php 
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = '/HealthConnection/root/src/'; // Usa una ruta relativa
$baseUrlSrcFooter = '/HealthConnection/root/src/';
require_once '../src/controllers/publicationController/selectPublication.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Connection</title>
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic; ?>images/tab_icon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/index.css">
    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    
</head>
<body class="bg-body-secondary ">
    <!-- Navbar -->
    <?php include  '../src/views/layouts/navbar.php'; ?>
    
    <main class="container my-4">
        <!-- Hero Section -->
        <section class="my-custom-hero hero row align-items-center p-4">
            <div class="hero-text col-md-7">
                <h2>AFÍLIATE AHORA!</h2>
                <p>¡Afíliate hoy y cuida de tu salud y bienestar con los mejores profesionales! Obtén acceso exclusivo a servicios médicos de calidad, descuentos especiales y atención personalizada. ¡Protege lo que más importa!</p>
                <!-- <button class="btn btn-primary">Leer más</button> -->
            </div>
            <div id="carouselExampleInterval" class="carousel slide col-md-5" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="10000">
                        <img src="<?php echo $baseUrlPublic; ?>images/medikit.png" class="d-block w-100" alt="Hospital">
                    </div>
                    <div class="carousel-item" data-bs-interval="2000">
                        <img src="<?php echo $baseUrlPublic; ?>images/medikit.png" class="d-block w-100" alt="Hospital">
                    </div>
                    <div class="carousel-item">
                        <img src="<?php echo $baseUrlPublic; ?>images/doctor.png" class="d-block w-100" alt="Hospital">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </section>
        
        <!-- Services Section -->
        <section class="services text-center">
            <h2>Nuestros Servicios</h2>
            <div class="row">
                <div class="col-md-4 p-sm-4 ">
                    <div class="card h-100 book-card shadow-sm">
                        <img src="<?php echo $baseUrlPublic; ?>images/citas.png" alt="Citas Médicas" class="card-img-top d-block mx-auto">
                        <div class="card-body">
                            <h3 class="card-title">Citas </h3>
                            <p class="card-text">Descripción breve del servicio.</p>
                            <a href="<?php echo $baseUrlSrc ?>views/admin/appointment/formularioCita.php" class="btn btn-warning">Agenda</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 p-sm-4">
                    <div class="card h-100 book-card shadow-sm">
                        <img src="<?php echo $baseUrlPublic; ?>images/citas.png" alt="Exámenes" class="card-img-top d-block mx-auto">
                        <div class="card-body">
                            <h3 class="card-title">Exámenes</h3>
                            <p class="card-text">Descripción breve del servicio.</p>
                            <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#examModal">
                                Leer más
                            </button>
                        </div>
                    </div>

                    <!-- modal -->
                    <div class="modal fade" id="examModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">¿No sabes cómo solicitar un examen?</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body text-start">
                                    Para solicitar tu examen, necesitas una autorización. Cuando la tengas, solo tienes que dirigirte al apartado de citas y en tipo de cita debes seleccionar "Examen". Se habilitará la opción para que subas tu autorización.
                                </div>
                            </div>
                        </div>
                    </div>           
                </div>
                <div class="col-md-4 p-sm-4">
                    <div class="card h-100 book-card shadow-sm">
                        <img src="<?php echo $baseUrlPublic; ?>images/examenes.png" alt="Jornadas de Vacunación" class="card-img-top d-block mx-auto">
                        <div class="card-body">
                            <h3 class="card-title"> Vacunación </h3>
                            <p class="card-text">Descripción breve del servicio.</p>
                            <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#vacunationModal">
                                Leer más
                            </button>
                        </div>
                    </div>

                    <!-- modal -->
                    <div class="modal fade" id="vacunationModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">¡Vacúnate!</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body text-start">
                                    ¡Protege tu salud y la de tu familia! Únete a nuestras jornadas de vacunación y asegúrate de estar al día con tus vacunas. Cuidar de tu bienestar es más fácil que nunca. ¡No esperes más, agenda tu cita hoy mismo!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sección de publicaciones -->
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    <?php foreach ($publicaciones as $publicacion): ?>
                        <div class="col">
                            <div class="card h-100 book-card shadow-sm">
                                <img src="<?php echo $baseUrlPublic; ?>uploads/publications/<?= htmlspecialchars($publicacion->imagen_publicacion) ?>" class="card-img-top d-block mx-auto my-2" alt="Imagen de la publicación">
                                <div class="card-body">
                                    <h5 class="book-title"><?php echo htmlspecialchars($publicacion->titulo); ?></h5>
                                    <p class="book-content"><?php echo htmlspecialchars($publicacion->contenido); ?></p>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
    </main>
    
    <!-- Footer -->
    <?php include '../src/views/layouts/footer.php'; ?>
    
    <script>
        window.onload = function() {
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role');

            if (role) {
                let message = '';
                switch (role) {
                    case 'Paciente':
                        message = 'Bienvenido Paciente!';
                        break;
                    case 'Doctor':
                        message = 'Bienvenido Doctor!';
                        break;
                    case 'Administrativo':
                        message = 'Bienvenido Administrativo!';
                        break;
                    default:
                        message = 'Bienvenido!';
                        break;
                }
                alert(message);
            }
        }
    </script>
</body>
</html>
