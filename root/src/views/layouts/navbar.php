<?php
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = '/HealthConnection/root/src/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAVBAR</title>
    <!-- !Importación de estilos con Bootstrap a través de CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- ! Importacion local de logo de ventana-->
    <link rel="shortcut icon" href="<?php echo $baseUrlPublic; ?>images/tab_icon.png" type="image/x-icon">
    <!--!Estilos locales -->
    <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/layouts/navbar.css">
</head>
<body>
    <nav class="navbar bg-body-tertiary fixed-top">
        <div class="container-fluid">
            <!--!Seccion del perfil   -->
            <div class="profile d-flex align-items-center">
                <a href="<?php echo $baseUrlSrc; ?>views/admin/editarPerfil.php">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff914d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                        <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                </a>
                <p id="user-rol" class="text-center ms-2 fs-5 " >ADMIN</p>
            </div>
            <!-- !Seccion del logo de la empresa -->
            <a class="navbar-brand fs-3" href="index">Health Connection</a>
            
            <!-- !Seccion de el boton de menu -->
            <button class="btn menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- !Seccion de menu -->
            <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptions">
                <!-- ! Seccion de header del menu/ boton de cierre -->
                <div class="offcanvas-header" >
                    <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Health Connection</h5>
                    <button type="button" class="btn-close " data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                
                <!-- ! opciones del menu -->
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li class="nav-item">
                            <a class="nav-link " aria-current="page" href="<?php echo $baseUrlPublic; ?>index.php">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="<?php echo $baseUrlPublic; ?>landingPage.php">About</a>
                        </li>
                        <!-- !Seccion de servicios -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Servicios
                            </a>
                            <!-- !Lista de servicios -->
                            <ul class="dropdown-menu px-2">
                                <li><a class="dropdown-item service-item" href="<?php echo $baseUrlSrc; ?>views/admin/verSolicitudes.php">Solicitudes</a></li>
                                <li><a class="dropdown-item service-item" href="<?php echo $baseUrlSrc; ?>views/admin/verRegistros.php">Registros</a></li>
                                <li><a class="dropdown-item service-item" href="<?php echo $baseUrlSrc; ?>views/admin/Publications/verPublications.php">Publicaciones</a></li>
                                <!-- <li><a class="dropdown-item service-item" href="./solicitudes-afiliacion.html">Generar Afiliacion</a></li> -->
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <!-- ! Importación de paquete de funcionalidades para estilos de Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>    
</html>
