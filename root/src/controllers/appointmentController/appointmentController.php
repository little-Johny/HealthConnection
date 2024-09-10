<?php
class AppointmentController {
    private $model;

    public function __construct($database) {
        $this->model = new appointmentModel($database);
    }

    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $action = isset($_POST['action']) ? $_POST['action'] : '';

            switch ($action) {
                case 'create':
                    $this->createAppointment();
                    break;
                case 'update':
                    $this->updateAppointment();
                    break;
                case 'delete':
                    $this->deleteAppointment();
                    break;
                default:
                    echo "Acción no válida.";
            }
        } else {
            $this->listAppointment();
        }
    }

    public function createAppointment() {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $doc_paciente = $_POST['doc_paciente'];
            $speciality = $_POST['speciality'];
            $type = $_POST['type'];
            $preferred_doctor = $_POST['preferred_doctor'];
            $date = $_POST['date'];
            $time = $_POST['time'];
            $costo = $_POST['costo'];
            $autorization = isset($_POST['autorization']) ? $_POST['autorization'] : null;
            $id_administrativo = isset($_POST['id_administrativo']) ? $_POST['id_administrativo'] : null;

            try {
                $query = $this->model->insertAppointment($doc_paciente, $speciality, $type, $preferred_doctor, $date, $time, $costo, $autorization, $id_administrativo);
                if ($query) {
                    header("Location: root/src/views/admin/verSolicitudes.php");
                    exit();
                } else {
                    header("Location: root/src/views/admin/verSolicitudes.php?message=error_cita");
                    exit();
                }
            } catch (Exception $error) {
                echo "Error: " . $error->getMessage();
            }
        }
    }

    public function listAppointment() {
        try {
            $citas = $this->model->checkAppointment();
            include 'root/src/views/admin/verSolicitudes.php';
        } catch (Exception $error) {
            echo "Error: " . $error->getMessage();
        }
    }

    public function updateAppointment() {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $id_cita = $_POST['id_cita'];
            $speciality = $_POST['speciality'];
            $type = $_POST['type'];
            $date = $_POST['date'];
            $time = $_POST['time'];
            $id_doctor = $_POST['id_doctor'];
            $autorization = isset($_POST['autorization']) ? $_POST['autorization'] : null;
            $id_administrativo = isset($_POST['id_administrativo']) ? $_POST['id_administrativo'] : null;

            try {
                $result = $this->model->updateAppointment($id_cita, $speciality, $type, $date, $time, $id_doctor, $autorization, $id_administrativo);
                if ($result) {
                    header("Location: root/src/views/admin/verSolicitudes.php?message=cita_actualizada");
                    exit();
                } else {
                    header("Location: root/src/views/admin/verSolicitudes.php?message=error_actualizacion");
                    exit();
                }
            } catch (Exception $error) {
                echo "Error: " . $error->getMessage();
            }
        }
    }

    public function deleteAppointment() {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $id_cita = $_POST['id_cita'];

            try {
                $result = $this->model->deleteAppointment($id_cita);
                if ($result) {
                    header("Location: root/src/views/admin/verSolicitudes.php?message=cita_eliminada");
                    exit();
                } else {
                    header("Location: root/src/views/admin/verSolicitudes.php?message=error_eliminacion");
                    exit();
                }
            } catch (Exception $error) {
                echo "Error: " . $error->getMessage();
            }
        }
    }
}
