const mysql = require('../lib/mysql'); // Módulo para manejar la conexión a MySQL
const boom = require('@hapi/boom');

class CitaService {
    // Registrar una nueva cita
    async registerCita(data) {
        const { paciente_id, doctor_id, tipo_cita_id, fecha, hora, costo, requiere_autorizacion } = data;

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            // Validar que el paciente exista
            const [patientExists] = await connection.query('SELECT id FROM Paciente WHERE id = ?', [paciente_id]);
            if (patientExists.length === 0) {
                throw boom.notFound('El paciente no existe');
            }

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

            await connection.commit();
            return {
                success: true,
                citaId: result.insertId,
                paciente_id,
                doctor_id,
                fecha,
                hora,
                costo
            };
        } catch (error) {
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error en el registro de la cita', error);
            }
            throw error;
        } finally {
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
