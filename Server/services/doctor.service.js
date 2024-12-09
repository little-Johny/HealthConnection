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
                INSERT INTO Doctor (usuario_id, especialidad_id, nombres, apellidos, foto, tipo_documento, numero_documento, genero, telefono, correo, horario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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

            if (!username || !password || !especialidad_id || !nombres || !apellidos || !tipo_documento || !numero_documento) {
                throw boom.badRequest('Faltan campos obligatorios para registrar el doctor');
            }

            
            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error creando el doctor');
            }

            await connection.commit();
            return {
                doctorId: result.insertId,
                nombres,
                apellidos,
                userId
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getActiveDoctors() {
        try {
            const query = `
                SELECT 
                    d.id AS doctorId, d.nombres, d.apellidos, d.foto, d.tipo_documento, d.numero_documento, d.genero, d.telefono, d.correo, d.horario, d.fecha_contratacion, u.username, u.rol, e.nombre AS especialidad
                FROM Doctor d
                JOIN Usuario u ON d.usuario_id = u.id
                JOIN Especialidad e ON d.especialidad_id = e.id
                WHERE u.activo = true;
            `;

            const [result] = await mysql.query(query);

            if (result.length === 0) {
                throw boom.notFound('No hay doctores activos');
            }

            return { doctores: result };
        } catch (error) {
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error al obtener los doctores activos', error);
            }
            throw error;
        }
    }

    async findByDocumento(documento) {
        try {
            const query = `
                SELECT 
                    d.*, u.username, u.rol, e.nombre AS especialidad
                FROM Doctor d
                JOIN Usuario u ON d.usuario_id = u.id
                JOIN Especialidad e ON d.especialidad_id = e.id
                WHERE d.numero_documento = ?;
            `;

            const [result] = await mysql.query(query, [documento]);

            if (result.length === 0) {
                throw boom.notFound('Doctor no encontrado');
            }

            return  result[0] ;
        } catch (error) {
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error al buscar el doctor', error);
            }
            throw error;
        }
    }

    async updateDoctor(documento, updates) {
        if (!documento) {
            throw boom.badRequest('El documento es requerido para actualizar un paciente.');
        }

        const doctor = await this.findByDocumento(documento);

        if (!doctor) {
            throw boom.notFound(`Doctor con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const values = [];
            const fields = [];
            const validFields = {
                foto: 'foto',
                nombres: 'nombres',
                apellidos:'apellidos',
                telefono: 'telefono',
                correo: 'correo',
                horario: 'horario',
            };

            if (updates.foto && doctor.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', doctor.foto);
                
                    if (fs.existsSync(oldFotoPath)) {
                        fs.unlinkSync(oldFotoPath);
                    }
                
            }

            for (let key in updates) {
                if (validFields[key]) {
                    fields.push(`${validFields[key]} = ?`);
                    values.push(updates[key]);
                }
            }

            if (fields.length === 0) {
                throw boom.badRequest('No hay campos válidos para actualizar.');
            }

            values.push(doctor.id);

            const query = `
                UPDATE Doctor
                SET ${fields.join(', ')}
                WHERE id = ?;
            `;

            const [result] = await connection.query(query, values);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error actualizando los datos del doctor.');
            }

            // Actualizar usuario si es necesario
            if ( updates.correo) {
                const userService = new UserService();
                const userUpdates = {};

                
                if (updates.correo) userUpdates.correo = updates.correo;

                const userResponse = await userService.updateUser(doctor.usuario_id, userUpdates);
                if (!userResponse.success) {
                    throw boom.badImplementation('Error actualizando el usuario relacionado.');
                }
            }

            await connection.commit();
            return {
                doctorId: doctor.id,
                updatedFields: Object.keys(updates),
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Método para desactivar doctor
    async deactivateDoctor(documento) {
        const doctor = await this.findByDocumento(documento);
        const userService = new UserService();
        await userService.deactivateUser(doctor.usuario_id);

        return {
            doctorId: doctor.id,
            usuarioId: doctor.usuario_id,
        };
    }

    async deleteDoctor(documento) {
        const doctor = await this.findByDocumento(documento);

        if (!doctor) {
            throw boom.notFound(`Doctor con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(`DELETE FROM Doctor WHERE numero_documento = ?;`,[documento]);
            await connection.query(`DELETE FROM Usuario WHERE id = ?;`, [doctor.usuario_id]);

            await connection.commit();
            return {
                doctorId: doctor.id,
                usuarioId: doctor.usuario_id,
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = DoctorService;
