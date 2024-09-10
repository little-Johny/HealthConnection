<?php
try {
    include_once '../../../config/databaseConexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $doc_paciente = $_POST['doc_paciente'];
        $specialty = $_POST['specialty'];
        $type = $_POST['type'];
        $preferred_doctor = $_POST['preferred_doctor'];
        $date = $_POST['date'];
        $time = $_POST['time'];
        $costo = $_POST['costo'];
        $autorization = $_POST['autorization'] ?? null;
        $asignador = null;
        $satate = 1;
        $solicitante='secretaria';
        $DOC_autorization =null;

        //! Verificación de la existencia del paciente por medio del número de documento
        $sentenciaPaciente = $database->prepare("SELECT COUNT(*) FROM Paciente WHERE numero_documento = ?");
        $sentenciaPaciente->execute([$doc_paciente]);
        $count = $sentenciaPaciente->fetchColumn();

        if ($count == 0) {
            throw new Exception("El número de documento del paciente no existe, verifica una vez más.");
        }
        
        // Verificar que la categoría y la especialidad no estén vacías
        if (empty($type) || empty($specialty)) {
            throw new Exception("Selecciona una categoría y una especialidad.");
        }

        // Insertar la cita en la base de datos
        $sql = $database->prepare("INSERT INTO Cita (id_paciente, id_doctor, asignador, solicitante, tipo_solicitante, fecha, hora, tipo_cita, costo, especialidad, requiere_autorizacion, documento_autorizacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )");
        $result = $sql->execute([$doc_paciente, $preferred_doctor, $asignador, $doc_paciente, 'paciente', $date, $time, $type, $costo, $specialty, $autorization,$DOC_autorization, 1]);

        if ($result) {
            echo "<script>
                alert('Solicitud exitosa');
                window.location.href = '/HealthConnection/root/public/index.php';
            </script>";
        } else {
            echo "Algo salió mal. ";
        }
    }
} catch (PDOException $error) {
    echo "Error: " . $error->getMessage();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

