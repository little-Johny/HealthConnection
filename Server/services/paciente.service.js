const boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const mysql = require('../config/db');
const UserService = require('./user.service');

class PacienteService {
    // Método para registrar un paciente
    async registerPaciente(data) {
        const {
            username,
            password,
            rol = 'paciente',
            nombres,
            apellidos,
            foto,
            tipo_documento,
            numero_documento,
            fecha_nacimiento,
            genero,
            telefono,
            correo,
            direccion,
            ciudad,
        } = data;

        const fotoPath = foto ? foto.replace(/\\/g, '/') : null;

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const [existingPatient] = await connection.query(
                'SELECT id FROM Paciente WHERE numero_documento = ?',
                [numero_documento]
            );
            if (existingPatient.length > 0) {
                throw boom.conflict('El número de documento ya está registrado');
            }

            // Registrar usuario asociado
            const userService = new UserService();
            const userResponse = await userService.registerUser({
                username,
                password,
                correo,
                rol,
            });

            if (!userResponse || !userResponse.success || !userResponse.userId) {
                throw boom.badImplementation('No se pudo crear el usuario asociado');
            }

            const userId = userResponse.userId;

            const query = `
                INSERT INTO Paciente (usuario_id, nombres, apellidos, foto, tipo_documento, numero_documento, fecha_nacimiento, genero, telefono, correo, direccion, ciudad)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const [result] = await connection.query(query, [
                userId,
                nombres,
                apellidos,
                fotoPath || null,
                tipo_documento,
                numero_documento,
                fecha_nacimiento,
                genero,
                telefono || null,
                correo || null,
                direccion || null,
                ciudad || null,
            ]);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error creando el paciente');
            }

            await connection.commit();

            return {
                patientId: result.insertId,
                nombres,
                apellidos,
                userId,
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Método para obtener pacientes activos
    async getActivePacientes() {
        const query = `
            SELECT 
                p.id AS pacienteId, p.nombres, p.apellidos, p.foto, p.tipo_documento, p.numero_documento, p.fecha_nacimiento, p.genero, p.telefono, p.correo, p.direccion, p.ciudad, u.username, u.rol
            FROM Paciente p
            JOIN Usuario u ON p.usuario_id = u.id
            WHERE u.activo = true;
        `;

        const [result] = await mysql.query(query);

        if (result.length === 0) {
            throw boom.notFound('No hay pacientes activos.');
        }

        return { patients: result };
    }

    // Método para encontrar paciente por documento
    async findByDocumento(documento) {
        try {
            const query = `
                SELECT 
                    p.*, u.username, u.rol
                FROM Paciente p
                JOIN Usuario u ON p.usuario_id = u.id
                WHERE p.numero_documento = ?;
            `;

            const [result] = await mysql.query(query, [documento]);

            if (result.length === 0) {
                throw boom.notFound('Paciente no encontrado');
            }

            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar paciente
    async updatePaciente(documento, updates) {
        if (!documento) {
            throw boom.badRequest('El documento es requerido para actualizar un paciente.');
        }

        const paciente = await this.findByDocumento(documento);

        if (!paciente) {
            throw boom.notFound(`Paciente con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const fields = [];
            const values = [];
            const validFields = {
                foto: 'foto',
                tipo_documento: 'tipo_documento',
                numero_documento: 'numero_documento',
                nombres: 'nombres',
                apellidos:'apellidos',
                telefono: 'telefono',
                correo: 'correo',
                direccion: 'direccion',
                ciudad: 'ciudad',
            };

            if (updates.foto && paciente.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', paciente.foto);
                    if (fs.existsSync(oldFotoPath)) {
                        fs.unlinkSync(oldFotoPath);
                    }
            }

            for (const key in updates) {
                if (validFields[key]) {
                    fields.push(`${validFields[key]} = ?`);
                    values.push(updates[key]);
                }
            }

            if (fields.length === 0) {
                throw boom.badRequest('No hay campos válidos para actualizar.');
            }

            values.push(paciente.id);

            const query = `
                UPDATE Paciente
                SET ${fields.join(', ')}
                WHERE id = ?;
            `;

            const [result] = await connection.query(query, values);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error actualizando los datos del paciente.');
            }

            // Actualizar usuario si es necesario
            if (updates.correo) {
                const userService = new UserService();
                const userUpdates = {};

                
                if (updates.correo) userUpdates.correo = updates.correo;

                const userResponse = await userService.updateUser(paciente.usuario_id, userUpdates);
                if (!userResponse.success) {
                    throw boom.badImplementation('Error actualizando el usuario relacionado.');
                }
            }


            await connection.commit();

            return {
                pacienteId: paciente.id,
                updatedFields: Object.keys(updates),
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Método para desactivar paciente
    async deactivatePaciente(documento) {
        const paciente = await this.findByDocumento(documento);
        const userService = new UserService();
        await userService.deactivateUser(paciente.usuario_id);

        return {
            pacienteId: paciente.id,
            usuarioId: paciente.usuario_id,
        };
    }

    // Método para eliminar paciente
    async deletePaciente(documento) {
        const paciente = await this.findByDocumento(documento);

        if (!paciente) {
            throw boom.notFound(`Paciente con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(`DELETE FROM Paciente WHERE numero_documento = ?;`, [documento]);
            await connection.query(`DELETE FROM Usuario WHERE id = ?;`, [paciente.usuario_id]);

            await connection.commit();

            return {
                pacienteId: paciente.id,
                usuarioId: paciente.usuario_id,
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = PacienteService;