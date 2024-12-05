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
            ciudad
        } = data;

        const fotoPath = foto ? foto.replace(/\\/g, '/') : null;

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            // Validar duplicados
            const [existingPatient] = await connection.query(
                'SELECT id FROM Paciente WHERE numero_documento = ?',
                [numero_documento]
            );
            if (existingPatient.length > 0) {
                throw boom.conflict('El número de documento ya está registrado');
            }

            // Crear usuario
            const userService = new UserService();
            const userResponse = await userService.registerUser({
                username,
                password,
                correo,
                rol
            });

            if (!userResponse || !userResponse.success || !userResponse.userId) {
                throw boom.badImplementation('No se pudo crear el usuario asociado');
            }

            const userId = userResponse.userId;

            // Crear paciente
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
                ciudad || null
            ]);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error creando el paciente');
            }

            await connection.commit();
            return {
                success: true,
                patientId: result.insertId,
                nombres,
                apellidos,
                userId
            };
        } catch (error) {
            await connection.rollback();
            throw this.handleError(error, 'Error en el registro del paciente');
        } finally {
            connection.release();
        }
    }

    // Método para obtener pacientes activos
    async getActivePacientes() {
        const query = `
            SELECT p.*, u.username, u.rol
            FROM Paciente p
            JOIN Usuario u ON p.usuario_id = u.id
            WHERE u.activo = true;
        `;

        try {
            const [result] = await mysql.query(query);
            if (result.length === 0) {
                throw boom.notFound('No hay pacientes activos');
            }

            return { success: true, pacientes: result };
        } catch (error) {
            throw this.handleError(error, 'Ocurrió un error al obtener los pacientes activos');
        }
    }

    // Método para encontrar paciente por documento
    async findByDocumento(numero_documento) {
        const query = `
            SELECT p.*, u.username, u.rol
            FROM Paciente p
            JOIN Usuario u ON p.usuario_id = u.id
            WHERE p.numero_documento = ?;
        `;

        try {
            const [result] = await mysql.query(query, [numero_documento]);

            if (result.length === 0) {
                throw boom.notFound('Paciente no encontrado');
            }

            return { success: true, paciente: result[0] };
        } catch (error) {
            throw this.handleError(error, 'Ocurrió un error al buscar el paciente');
        }
    }

    // Método para actualizar paciente
    async updatePaciente(documento, updates) {
        const paciente = await this.findByDocumento(documento);

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const fields = [];
            const values = [];
            const items = {
                foto: 'foto',
                tipo_documento: 'tipo_documento',
                numero_documento: 'numero_documento',
                telefono: 'telefono',
                correo: 'correo',
                direccion: 'direccion',
                ciudad: 'ciudad',
            };

            // Verificación de cambio de imagen
            if (updates.foto && paciente.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', paciente.foto);
                if (fs.existsSync(oldFotoPath)) {
                    fs.unlinkSync(oldFotoPath); // Eliminación de imagen antigua
                }
            }

            // Construcción dinámica de campos para actualizar
            for (let key in updates) {
                if (items[key]) {
                    fields.push(`${items[key]} = ?`);
                    values.push(updates[key]);
                }
            }

            // Verificar si hay campos válidos
            if (fields.length === 0) {
                throw boom.badRequest('No hay campos válidos para actualizar.');
            }

            values.push(paciente.paciente.id);

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
            if (updates.username || updates.correo) {
                const userService = new UserService();
                const userUpdates = {};

                if (updates.username) userUpdates.username = updates.username;
                if (updates.correo) userUpdates.correo = updates.correo;

                const userResponse = await userService.updateUser(paciente.paciente.usuario_id, userUpdates);
                if (!userResponse.success) {
                    throw boom.badImplementation('Error actualizando el usuario relacionado.');
                }
            }

            await connection.commit();

            return {
                success: true,
                message: 'Paciente actualizado correctamente',
                pacienteId: paciente.paciente.id,
            };
        } catch (error) {
            await connection.rollback();
            throw this.handleError(error, 'Error durante la actualización del paciente');
        } finally {
            connection.release();
        }
    }

    async deactivatePaciente(documento) {
        const paciente = await this.findByDocumento(documento);
        
        if (!paciente.success) {
            throw boom.notFound(`Paciente con documento ${documento} no encontrado.`);
        }

        // Desactivar el usuario relacionado
        const userService = new UserService();
        const userResponse = await userService.deactivateUser(paciente.paciente.usuario_id);

        return {
            success: true,
            message: `Paciente con documento ${documento} y su usuario desactivados correctamente.`,
        };
    }

    // Método para eliminar paciente
    async deletePaciente(documento) {
        const paciente = await this.findByDocumento(documento);

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const deletePacienteQuery = `
                DELETE FROM Paciente WHERE numero_documento = ?;
            `;
            const [deletePacienteResult] = await connection.query(deletePacienteQuery, [documento]);

            if (deletePacienteResult.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando los datos del paciente.');
            }

            const deleteUsuarioQuery = `
                DELETE FROM Usuario WHERE id = ?;
            `;
            const [deleteUsuarioResult] = await connection.query(deleteUsuarioQuery, [paciente.paciente.usuario_id]);

            if (deleteUsuarioResult.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando el usuario relacionado.');
            }

            await connection.commit();

            return {
                success: true,
                message: 'Paciente y usuario eliminados correctamente.',
            };
        } catch (error) {
            await connection.rollback();
            throw this.handleError(error, 'Error durante la eliminación del paciente');
        } finally {
            connection.release();
        }
    }

    // Manejo de errores estandarizado
    handleError(error, defaultMessage) {
        if (!error.isBoom) {
            throw boom.badImplementation(defaultMessage, error);
        }
        throw error;
    }
}

module.exports = PacienteService;
