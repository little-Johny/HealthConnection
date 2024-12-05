const boom = require('@hapi/boom');
const mysql = require('../config/db');
const UserService = require('./user.service');

class DoctorService {
    async registerDoctor(data) {
        const {
            username,
            password,
            rol = 'doctor',
            especialidad_id,
            nombres,
            apellidos,
            foto,
            tipo_documento,
            numero_documento,
            genero,
            telefono,
            correo,
            horario,
            
        } = data;

        const fotoPath = foto ? foto.replace(/\\/g, '/') : null;
        

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            // Validar duplicados
            const [existingDoctor] = await connection.query(
                'SELECT id FROM Doctor WHERE numero_documento = ?',
                [numero_documento]
            );
            if (existingDoctor.length > 0) {
                throw boom.conflict('El número de documento ya está registrado');
            }

            // Validar especialidad
            const [specialtyExists] = await connection.query(
                'SELECT id FROM Especialidad WHERE id = ?',
                [especialidad_id]
            );
            if (specialtyExists.length === 0) {
                throw boom.notFound('Especialidad no encontrada');
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

            // Crear doctor
            const query = `
                INSERT INTO Doctor (usuario_id, especialidad_id, nombres, apellidos, foto, tipo_documento, numero_documento, genero, telefono, correo, horario, tarjeta_profesional)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const [result] = await connection.query(query, [
                userId,
                especialidad_id,
                nombres,
                apellidos,
                fotoPath || null,
                tipo_documento,
                numero_documento,
                genero || null,
                telefono || null,
                correo || null,
                horario || null,
            ]);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error creando el doctor');
            }

            await connection.commit();
            return {
                success: true,
                doctorId: result.insertId,
                nombres,
                apellidos,
                userId
            };
        } catch (error) {
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error en el registro del doctor', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }

    async getActiveDoctors() {
        try {
            const query = `
                SELECT d.*, u.username, u.rol, e.nombre AS especialidad
                FROM Doctor d
                JOIN Usuario u ON d.usuario_id = u.id
                JOIN Especialidad e ON d.especialidad_id = e.id
                WHERE u.activo = true;
            `;

            const [result] = await mysql.query(query);

            if (result.length === 0) {
                throw boom.notFound('No hay doctores activos');
            }

            return { success: true, doctores: result };
        } catch (error) {
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error al obtener los doctores activos', error);
            }
            throw error;
        }
    }

    async findByDocumento(numero_documento) {
        try {
            const query = `
                SELECT d.*, u.username, u.rol, e.nombre AS especialidad
                FROM Doctor d
                JOIN Usuario u ON d.usuario_id = u.id
                JOIN Especialidad e ON d.especialidad_id = e.id
                WHERE d.numero_documento = ?;
            `;

            const [result] = await mysql.query(query, [numero_documento]);

            if (result.length === 0) {
                throw boom.notFound('Doctor no encontrado');
            }

            return { success: true, doctor: result[0] };
        } catch (error) {
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error al buscar el doctor', error);
            }
            throw error;
        }
    }

    async updateDoctor(numero_documento, updates) {
        const doctor = await this.findByDocumento(numero_documento);

        if (!doctor) {
            throw boom.notFound(`Doctor con documento ${numero_documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const items = {
                foto: 'foto',
                tipo_documento: 'tipo_documento',
                numero_documento: 'numero_documento',
                telefono: 'telefono',
                correo: 'correo',
                horario: 'horario',
            };

            const values = [];
            const fields = [];

            if (updates.foto && doctor.doctor.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', doctor.doctor.foto);
                try {
                    if (fs.existsSync(oldFotoPath)) {
                        fs.unlinkSync(oldFotoPath);
                    }
                } catch (error) {
                    throw boom.badImplementation('Error eliminando imagen antigua.');
                }
            }

            for (let key in updates) {
                if (items[key]) {
                    fields.push(`${items[key]} = ?`);
                    values.push(updates[key]);
                }
            }

            if (fields.length === 0) {
                throw boom.badRequest('No hay campos válidos para actualizar.');
            }

            values.push(doctor.doctor.id);

            const query = `
                UPDATE Doctor
                SET ${fields.join(', ')}
                WHERE id = ?;
            `;

            const [result] = await connection.query(query, values);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error actualizando los datos del doctor.');
            }

            await connection.commit();
            return {
                success: true,
                message: 'Doctor actualizado correctamente',
                doctorId: doctor.doctor.id,
            };
        } catch (error) {
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error durante la actualización del doctor.', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }

    async deleteDoctor(numero_documento) {
        const doctor = await this.findByDocumento(numero_documento);

        if (!doctor) {
            throw boom.notFound(`Doctor con documento ${numero_documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const deleteDoctorQuery = `
                DELETE FROM Doctor WHERE numero_documento = ?;
            `;
            const [deleteDoctorResult] = await connection.query(deleteDoctorQuery, [numero_documento]);

            if (deleteDoctorResult.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando los datos del doctor.');
            }

            const deleteUsuarioQuery = `
                DELETE FROM Usuario WHERE id = ?;
            `;
            const [deleteUsuarioResult] = await connection.query(deleteUsuarioQuery, [doctor.doctor.usuario_id]);

            if (deleteUsuarioResult.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando el usuario relacionado.');
            }

            await connection.commit();
            return {
                success: true,
                message: 'Doctor y usuario eliminados correctamente.'
            };
        } catch (error) {
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error durante la eliminación del doctor.', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = DoctorService;
