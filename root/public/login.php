<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="shortcut icon" href="../images/tab_icon.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Coustard:wght@400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

        :root {
            --color-principal: #ff914d;
            --color-secundario: #6C5F5B;
            --color-complementario: #4F4A45;
            --negro: #151515;
            --white: #FFFFFF;
            --fuente-principal: "Roboto Mono", monospace;
            --small-font: 14px;
            --medium-font: 16px;
            --large-font: 18px;
        }

        body, html {
            height: 100%;
            margin: 0;
            font-family: var(--fuente-principal);
        }
        .container-fluid {
            padding: 0;
        }
        .bg-image {
            background-image: url('./images/BackgroundHC.jpg'); /* Reemplaza con la URL de tu imagen */
            background-size: cover;
            background-position: center;
            height: 100%;
            width: 100%;
        }

        .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 20px;
        }
        .form {
            background-color: var(--color-principal);
            display: flex;
            flex-direction: column;
        }
        .title {
            color: var(--white);
            margin-bottom: 80px;
        }
        .card {
            max-width: 400px;
            width: 100%;
            box-shadow: 10px 8px 16px var(--color-complementario);
        }
        .login {
            color: var(--white);
            text-decoration: none;
        }

        @media (max-width: 576px) {
            .bg-image {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container-fluid h-100 w-100">
        <div class="row g-0 h-100">
            <!-- Left Side Image for larger screens -->
            <div class="col-lg-6 bg-image d-none d-lg-block"></div>

            <!-- Login Form -->
            <div class="col-lg-6 d-flex align-items-center justify-content-center form">
                <h1 class="title">Tu salud, nuestra prioridad</h1>
                <div class="card p-4">
                    <h2 class="text-center mb-4">Login</h2>
                    <form action="../src/controllers/loginController.php" method="POST">
                        <div class="mb-3">
                            <label for="document" class="form-label">Número de documento</label>
                            <input type="text" class="form-control" id="document" name="document" placeholder="Escribe tu número de documento" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Enter your password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Entrar</button>
                    </form>
                    <hr>
                    <p class="text-center">No tienes una cuenta? <a href="./register.html">Regístrate</a></p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
