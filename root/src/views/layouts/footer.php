<?php
$baseUrlPublic = '/HealthConnection/root/public/';
$baseUrlSrc = '/HealthConnection/root/src/';
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FOOTER</title>
        <!-- ! Importación de estilos con Bootstrap a través de CDN -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <!-- ! Importación local de logo de ventana-->
        <link rel="shortcut icon" href="<?php echo $baseUrlPublic; ?>images/tab_icon.png" type="image/x-icon">
        <!-- ! Añadir Bootstrap Icons CDN -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.3/font/bootstrap-icons.min.css">
        <!--! Estilos locales -->
        <link rel="stylesheet" href="<?php echo $baseUrlPublic; ?>css/layouts/footer.css">
    </head>
    

<body class="body-footer">
    <footer class="footer">
        <div class="container">
            <div class="social-icons mb-3">
                <a href="#" class="text-decoration-none" aria-label="Twitter"><i class="bi bi-twitter"></i> Twitter</a>
                <a href="#" class="text-decoration-none" aria-label="YouTube"><i class="bi bi-youtube"></i> YouTube</a>
                <a href="#" class="text-decoration-none" aria-label="Facebook"><i class="bi bi-facebook"></i> Facebook</a>
            </div>
            <p class="mb-0">&copy; 2024 - Health Connection</p>
        </div>
    </footer>
    
    <!-- ! Importación de paquete de funcionalidades para estilos de Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
