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
    <title>Registrate | Health Connection</title>
    <!-- <link rel="stylesheet" href="../../src/output.css"> -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex font-mono bg-[url('/public/images/Doctor.png')] bg-no-repeat bg-cover bg-center justify-end backdrop-brightness-50 backdrop-blur-[5px]"> 
        <!-- Botón Volver -->
        <div class="absolute top-4 left-4">
            <a href="/src/index.php" class="bg-orange-400 text-black px-4 py-2 rounded-lg">Volver</a>
        </div>

        <!-- Seccion Formulario -->
        <div class="w-1/2 flex items-center justify-center m-3">
            <div class="w-full max-w-3/5 p-8 bg-white rounded-lg shadow-md">
                <div class="text-center mb-6">
                    <img src="/public/images/user.png" alt="iconoLogin" class="h-16 mx-auto mb-4">
                    <h1 class="text-2xl">Registrate</h1>
                </div>

        <!-- Seccion Formulario -->
        <div class="mb-2 flex space-x-4">
            <!-- Tipo de Documento -->
            <div class="w-1/2">
                <label for="tipoDoc" class="block text-gray-600 mb-2">Tipo de Documento:</label>
                    <select name="tipoDoc" id="tipoDoc" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                        <option value="#">Selecciona el tipo de Documento</option>
                        <option value="1">Cedula de Cuidadania</option>
                        <option value="2">Tarjeta de Identidad</option>
                        <option value="3">Registro Civil</option>
                        <option value="4">Cedula de Extranjeria</option>
                    </select>
            </div>

            <!-- Numero de Documento -->
            <div class="w-1/2">
                <label for="numDoc" class="block text-gray-600 mb-2">Numero de Documento:</label>
                <input type="text" name="numDoc" id="numDoc" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
            </div>
        </div>

        <div class="mb-2 flex space-x-4">
            <!-- Nombre -->
             <div class="w-1/2">
                <label for="nombreUsuario" class="block text-gray-600 mb-2">Nombres:</label>
                <input type="text" name="nombreUsuario" id="nombreUsuario" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
             </div>

             <!-- Apellidos -->
             <div class="w-1/2">
                <label for="apellidoUsuario" class="block text-gray-600 mb-2">Apellidos:</label>
                <input type="text" name="apellidoUsuario" id="apellidoUsuario" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
             </div>
        </div>

        <div class="mb-2 flex space-x-4">
            <!-- Fecha de Nacimiento -->
            <div class="w-1/2">
                <label for="fechaNacimiento" class="block text-gray-600 mb-2">Fecha de Nacimiento:</label>
                <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
            </div>

            <!-- Genero -->
            <div class="w-1/2">
                <label for="genero" class="block text-gray-600 mb-2">Genero:</label>
                <select name="genero" id="genero" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="#">Seleccion tu genero</option>
                    <option value="1">Masculino</option>
                    <option value="2">Femenino</option>
                    <option value="3">Otro</option>
                </select>
            </div>
        </div>

        <div class="">

        </div>
</body>