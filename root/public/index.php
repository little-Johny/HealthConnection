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
                <p>Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi.</p>
                <button class="btn btn-primary">Leer más</button>
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
                    <div class="card p-4 ">
                        <img src="<?php echo $baseUrlPublic; ?>images/citas.png" alt="Citas Médicas" class="card-img-top">
                        <div class="card-body">
                            <h3 class="card-title">Citas </h3>
                            <p class="card-text">Descripción breve del servicio.</p>
                            <a href="<?php echo $baseUrlSrc ?>views/admin/appointment/formularioCita.php" class="btn btn-primary">Agenda</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 p-sm-4">
                    <div class="card p-4 ">
                        <img src="<?php echo $baseUrlPublic; ?>images/citas.png" alt="Exámenes" class="card-img-top">
                        <div class="card-body">
                            <h3 class="card-title">Exámenes</h3>
                            <p class="card-text">Descripción breve del servicio.</p>
                            <a href="" class="btn btn-primary">Leer más</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 p-sm-4">
                    <div class="card p-4">
                        <img src="<?php echo $baseUrlPublic; ?>images/examenes.png" alt="Jornadas de Vacunación" class="card-img-top">
                        <div class="card-body">
                            <h3 class="card-title"> Vacunación </h3>
                            <p class="card-text">Descripción breve del servicio.</p>
                            <button class="btn btn-primary">Leer más</button>
                        </div>
                    </div>
                </div>
                <!-- Más tarjetas de servicio -->
            </div>
        </section>
    </main>
    
    <!-- Footer -->
    <?php include '../src/views/layouts/footer.php'; ?>
    
    <script>
        window.onload = function() {
            // Obtén el parámetro de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role');

            // Muestra un mensaje de bienvenida basado en el rol
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
