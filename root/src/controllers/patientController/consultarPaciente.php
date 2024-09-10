<?php
try {
    // Conexión a la base de datos
    require_once 'C:\xampp\htdocs\HealthConnection\root\config\databaseConexion.php';

    // Preparar la consulta para obtener todos los pacientes con detalles adicionales
    $sentencia = $database->prepare("
    SELECT 
            p.numero_documento,
            p.nombre,
            p.apellido,
            p.tipo_doc,
            p.fecha_de_nacimiento,
            p.genero,
            p.telefono,
            p.email,
            p.direccion,
            p.contraseña,
            p.id_plan_afiliacion,
            p.foto_perfil,
            p.id_rol,
            p.estado,
            p.afiliado,
            d.direccion AS direccion_texto,
            a.nombre_plan AS plan_afiliacion
        FROM 
            Paciente p
            LEFT JOIN Direccion d ON p.direccion = d.id_direccion
            LEFT JOIN Afiliacion a ON p.id_plan_afiliacion = a.id_afiliacion
    ");
    $sentencia->execute();
    $pacientes = $sentencia->fetchAll(PDO::FETCH_OBJ);

    // Pasar los datos a la vista
    $paciente = $pacientes;
} catch (PDOException $error) {
    echo "Error de base de datos: " . $error->getMessage();
}

