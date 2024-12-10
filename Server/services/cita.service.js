const mysql = require('../config/db');
const boom = require('@hapi/boom');
const PacienteService = require('../services/paciente.service');

const pacienteService = new PacienteService();

class CitaService {

    async getTipoCita() {
        try {
            const  query = `SELECT id, nombre, costo_adicional FROM TipoCita;`;

            const [result]= await mysql.query(query);
            
            if(result.length === 0) {
                throw boom.notFound('No se encuentran tipos de cita');
            }

            return result;
        } catch (error) {
            throw  error;
        }
    }

    // Registrar una nueva cita
    async registerCita(data, paciente_id) {
        const { doctor_id, tipo_cita_id, fecha, hora, costo, requiere_autorizacion = false } = data;
        
        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            
    
            // Validar que el doctor exista
            const [doctorExists] = await connection.query('SELECT id FROM Doctor WHERE id = ?', [doctor_id]);
            if (doctorExists.length === 0) {
                throw boom.notFound('El doctor no existe');
            }
    
            // Validar que el tipo de cita exista
            const [typeExists] = await connection.query('SELECT id FROM TipoCita WHERE id = ?', [tipo_cita_id]);
            if (typeExists.length === 0) {
                throw boom.notFound('El tipo de cita no existe');
            }
    
            // Insertar la cita
            const query = `
                INSERT INTO Cita (paciente_id, doctor_id, tipo_cita_id, fecha, hora, costo, requiere_autorizacion)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `;
            const [result] = await connection.query(query, [
                paciente_id,
                doctor_id,
                tipo_cita_id,
                fecha,
                hora,
                costo,
                requiere_autorizacion || false
            ]);
    
            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error registrando la cita');
            }
    
            // Confirmar transacción
            await connection.commit();
    
            // Retornar información de la cita registrada
            return {
                
                citaId: result.insertId,
                paciente_id,
                doctor_id,
                fecha,
                hora,
                costo
            };
        } catch (error) {
            // Si ocurre un error, hacer rollback
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error en el registro de la cita', error);
            }
            throw error;
        } finally {
            // Liberar la conexión
            connection.release();
        }
    }
    

    // Obtener todas las citas
    async getAllCitas() {
        const query = `
            SELECT c.id, c.fecha, c.hora, c.costo, c.requiere_autorizacion,
                    p.nombres AS paciente_nombre, p.apellidos AS paciente_apellido,
                    d.nombres AS doctor_nombre, d.apellidos AS doctor_apellido,
                    t.nombre AS tipo_cita
            FROM Cita c
            JOIN Paciente p ON c.paciente_id = p.id
            JOIN Doctor d ON c.doctor_id = d.id
            JOIN TipoCita t ON c.tipo_cita_id = t.id;
        `;
        const [rows] = await mysql.query(query);
        return rows;
    }

    // Buscar una cita por ID
    async getCitaById(id) {
        const query = `
            SELECT c.id, c.fecha, c.hora, c.costo, c.requiere_autorizacion,
                    p.nombres AS paciente_nombre, p.apellidos AS paciente_apellido,
                    d.nombres AS doctor_nombre, d.apellidos AS doctor_apellido,
                    t.nombre AS tipo_cita
            FROM Cita c
            JOIN Paciente p ON c.paciente_id = p.id
            JOIN Doctor d ON c.doctor_id = d.id
            JOIN TipoCita t ON c.tipo_cita_id = t.id
            WHERE c.id = ?;
        `;
        const [rows] = await mysql.query(query, [id]);
        if (rows.length === 0) {
            throw boom.notFound('Cita no encontrada');
        }
        return rows[0];
    }

    async getCitasByPaciente(userId) {
        const connection = await mysql.getConnection();
        try {
            // Buscar el ID del paciente asociado al usuario
            const queryPaciente = `
                SELECT p.id AS paciente_id
                FROM Paciente p
                JOIN Usuario u ON p.usuario_id = u.id
                WHERE u.id = ?;
            `;
            const [resultPaciente] = await connection.query(queryPaciente, [userId]);
            if (resultPaciente.length === 0) {
                throw boom.notFound('No se encontró un paciente asociado al usuario.');
            }
    
            const pacienteId = resultPaciente[0].paciente_id;
    
            // Buscar las citas del paciente
            const queryCitas = `
                SELECT c.id, c.fecha, c.hora, c.costo, c.requiere_autorizacion,
                        d.nombres AS doctor_nombre, d.apellidos AS doctor_apellido,
                        t.nombre AS tipo_cita
                FROM Cita c
                JOIN Doctor d ON c.doctor_id = d.id
                JOIN TipoCita t ON c.tipo_cita_id = t.id
                WHERE c.paciente_id = ?;
            `;
            const [citas] = await connection.query(queryCitas, [pacienteId]);
            return citas;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
    
    async getCitasByDoctor(userId) {
        const connection = await mysql.getConnection();
        try {
            // Buscar el ID del doctor asociado al usuario
            const queryDoctor = `
                SELECT d.id AS doctor_id
                FROM Doctor d
                JOIN Usuario u ON d.usuario_id = u.id
                WHERE u.id = ?;
            `;
            const [resultDoctor] = await connection.query(queryDoctor, [userId]);
            if (resultDoctor.length === 0) {
                throw boom.notFound('No se encontró un doctor asociado al usuario.');
            }
    
            const doctorId = resultDoctor[0].doctor_id;
    
            // Buscar las citas del doctor
            const queryCitas = `
                SELECT c.id, c.fecha, c.hora, c.costo, c.requiere_autorizacion,
                        p.nombres AS paciente_nombre, p.apellidos AS paciente_apellido,
                        t.nombre AS tipo_cita
                FROM Cita c
                JOIN Paciente p ON c.paciente_id = p.id
                JOIN TipoCita t ON c.tipo_cita_id = t.id
                WHERE c.doctor_id = ?;
            `;
            const [citas] = await connection.query(queryCitas, [doctorId]);
            return citas;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
    

    // Actualizar una cita
    async updateCita(id, updates) {
        const query = `
            UPDATE Cita
            SET ?
            WHERE id = ?;
        `;
        const [result] = await mysql.query(query, [updates, id]);
        if (result.affectedRows === 0) {
            throw boom.notFound('Cita no encontrada');
        }
        return {
            success: true,
            updatedId: id,
            updates
        };
    }

    // Eliminar una cita
    async deleteCita(id) {
        const query = `
            DELETE FROM Cita WHERE id = ?;
        `;
        const [result] = await mysql.query(query, [id]);
        if (result.affectedRows === 0) {
            throw boom.notFound('Cita no encontrada');
        }
        return {
            success: true,
            deletedId: id
        };
    }
}

module.exports = CitaService;
