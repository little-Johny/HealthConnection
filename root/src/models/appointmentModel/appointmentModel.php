<?php
class AppointmentModel {

    //! Conexión a la base de datos
    private $database;

    public function __construct($pdo) {
        $this->database = $pdo;
    }

    public function insertAppointment($doc_paciente, $speciality, $type, $preferred_doctor, $date, $time, $costo, $autorization = null, $id_administrativo = null) {
        try {
            // Verificación de la existencia del paciente
            $sentenciaPaciente = $this->database->prepare("SELECT COUNT(*) FROM Paciente WHERE numero_documento = ?");
            $sentenciaPaciente->execute([$doc_paciente]);
            $count = $sentenciaPaciente->fetchColumn();
    
            if ($count == 0) {
                throw new Exception("El número de documento del paciente no existe, verifica una vez más.");
            }
    
            // Verificar que la categoría y la especialidad no estén vacías
            if (empty($type) || empty($speciality)) {
                throw new Exception("Selecciona una categoría y una especialidad.");
            }
    
            // Insertar la cita en la base de datos
            $sql = $this->database->prepare("
                INSERT INTO Cita (id_paciente, id_doctor, id_Administrativos, fecha, hora, tipo_cita, costo, especialidad, requiere_autorizacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            // Condicional para manejar autorization null
            $result = $sql->execute([$doc_paciente, $preferred_doctor, $id_administrativo, $date, $time, $type, $costo, $speciality, $autorization !== null ? 1 : 0]);
    
            return $result; // Retornar verdadero si se insertó correctamente
    
        } catch (PDOException $error) {
            throw new Exception("Error de base de datos: " . $error->getMessage());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
    
    
    public function checkAppointment() {
        try {
            $sentencia = $this->database->query("
                SELECT C.id_cita, P.nombre AS paciente, E.nombre_especialidad AS especialidad, C.fecha, C.hora
                FROM Cita C
                JOIN Paciente P ON C.id_paciente = P.numero_documento
                JOIN Especialidad E ON C.especialidad = E.id_especialidad
            ");
            return $sentencia->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            throw new Exception("Error al consultar citas: " . $e->getMessage());
        }
    }

    public function updateAppointment($id_cita, $speciality, $type, $date, $time, $id_doctor, $autorization, $id_administrativo) {
        try {
            // Obtener el costo de la especialidad
            $consultaEspecialidad = $this->database->prepare("SELECT costo FROM Especialidad WHERE id_especialidad = ?");
            $consultaEspecialidad->execute([$speciality]);
            $costoEspecialidad = $consultaEspecialidad->fetchColumn();
    
            // Obtener el costo adicional del tipo de cita
            $consultaTipoCita = $this->database->prepare("SELECT costo_adicional FROM TipoCita WHERE id_tipo = ?");
            $consultaTipoCita->execute([$type]);
            $costoTipoCita = $consultaTipoCita->fetchColumn();
    
            // Calcular el costo total
            $costoTotal = $costoEspecialidad + $costoTipoCita;
    
            // Actualizar la cita
            $sentencia = $this->database->prepare("
                UPDATE Cita
                SET especialidad = ?, tipo_cita = ?, fecha = ?, hora = ?, id_doctor = ?, costo = ?, requiere_autorizacion = ?, id_Administrativos = ?
                WHERE id_cita = ?
            ");
    
            return $sentencia->execute([$speciality, $type, $date, $time, $id_doctor, $costoTotal, $autorization, $id_administrativo, $id_cita]);
        } catch (PDOException $error) {
            throw new Exception("Error de base de datos: " . $error->getMessage());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
    
    public function deleteAppointment($id_cita) {
        try {
            $sentencia = $this->database->prepare("DELETE FROM Cita WHERE id_cita = ?");
            return $sentencia->execute([$id_cita]);
        } catch (PDOException $error) {
            throw new Exception("Error de base de datos: " . $error->getMessage());
        }
    }
}

