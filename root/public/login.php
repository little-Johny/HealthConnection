<?php
// Iniciar la sesión
session_start();

// Verificar si el formulario ha sido enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Aquí deberías verificar las credenciales con tu base de datos
    // Este es solo un ejemplo y no debe usarse en producción
    if ($username === "usuario" && $password === "contraseña") {
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        header("Location: dashboard.php"); // Redirigir a la página del dashboard
        exit;
    } else {
        $error = "Usuario o contraseña incorrectos";
    }
}
?>
<?php
// ... (el código PHP anterior permanece igual)
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login EPS</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-image: url('https://img.freepik.com/free-vector/flat-hand-drawn-hospital-reception-scene_52683-54613.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            height: 100vh;
        }
        .login-container {
            background-color: rgba(29, 28, 28, 0.8);
            border-radius: 10px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
        }
        .text-light {
            color: #fff !important;
        }
    </style>
</head>
<body>
    
</body>
</html>
    <div class="container d-flex justify-content-center align-items-center h-100">
        <div class="login-container">
            <h2 class="text-center mb-4 text-light">Iniciar Sesión</h2>
            <?php
            if (isset($error)) {
                echo "<p class='text-danger text-center'>$error</p>";
            }
            ?>
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
                <div class="mb-3">
                    <label for="username" class="form-label text-light">Usuario</label>
                    <input type="text" class="form-control" id="username" name="username" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label text-light">Contraseña</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Ingresar</button>
            </form>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>