<?php
    // conectar base de datos
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "health_connectiondb";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // verificar conexion
    if ($conn->connect_error) {
        die("Conexion Fallida: " . $conn -> connect_error);
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio Sesion | Health Connection</title>
    <!-- <link rel="stylesheet" href="../../src/output.css"> -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
    <body class="min-h-screen flex font-mono bg-[url('/public/images/Doctor.png')] bg-no-repeat bg-cover bg-center justify-end backdrop-brightness-50 backdrop-blur-[5px]"> 
        <!-- Botón Volver -->
        <div class="absolute top-4 left-4">
            <a href="/src/index.php" class="bg-orange-400 text-black px-4 py-2 rounded-lg">Volver</a>
        </div>

        <!-- Seccion Formulario -->
        <div class="w-1/3 flex items-center justify-center m-3">
            <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div class="text-center mb-6">
                    <img src="/public/images/user.png" alt="iconoLogin" class="h-16 mx-auto mb-4">
                    <h1 class="text-2xl">Inicio de Sesion</h1>
                </div>

        <!-- Seccion Formulario -->
        <div class="mb-4">
            <label for="tipoDoc" class="block text-gray-600 mb-2">Tipo de Documento:</label>
            <select name="tipoDoc" id="tipoDoc" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="#">Selecciona el tipo de Documento</option>
                    <option value="1">Cedula de Cuidadania</option>
                    <option value="2">Tarjeta de Identidad</option>
                    <option value="3">Registro Civil</option>
                    <option value="4">Cedula de Extranjeria</option>
            </select>
        </div>

        <!-- Numero de Documento -->
        <div class="mb-4">
            <label for="numDoc" class="block text-gray-600 mb-2">Numero de Documento:</label>
            <input type="text" name="numDoc" id="numDoc" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
        </div>

        <!-- Contraseña -->
        <div class="mb-4">
            <label for="contrasena" class="block text-gray-600 mb-2">Contraseña:</label>
            <input type="password" name="contrasena" id="contrasena" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
        </div>

        <div class="flex justify-between mb-6">
            <a href="/public/php/register.php" class="text-sm text-blue-500 hover:underline">No te has registrado?</a>
        </div>

        <!-- Boton Ingresar -->
        <div class="mb-6">
        <button type="submit" class="w-full bg-orange-400 text-black p-3 rounded-lg">Ingresar</button>
        </div>
    </body>
</html>