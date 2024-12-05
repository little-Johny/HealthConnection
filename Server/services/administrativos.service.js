const boom = require('@hapi/boom');
const mysql = require('../config/db');
const UserService = require('./user.service');
const path = require('path');
const fs = require('fs');

class PersonalAdministrativoService {

    // Método para registrar un nuevo personal administrativo
    async registerPersonalAdministrativo(data) {
        const {
            username,
            password,
            rol,
            nombres,
            apellidos,
            foto,
            tipo_documento,
            numero_documento,
            genero,
            telefono,
            correo,
            horario
        } = data;
    
        // Validar campos obligatorios
        if (!username || !password || !rol || !nombres || !apellidos || !tipo_documento || !numero_documento) {
            throw boom.badRequest('Los campos username, password, rol, nombres, apellidos, tipo_documento y numero_documento son obligatorios.');
        }
    
        const fotoPath = foto ? foto.replace(/\\/g, '/') : null;
    
        const connection = await mysql.getConnection();
        await connection.beginTransaction();
    
        try {
            // Validar duplicados
            const [existingPersonal] = await connection.query(
                'SELECT id FROM PersonalAdministrativo WHERE numero_documento = ?',
                [numero_documento]
            );
            if (existingPersonal.length > 0) {
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
    
            // Crear personal administrativo
            const query = `
                INSERT INTO PersonalAdministrativo (usuario_id, nombres, apellidos, foto, tipo_documento, numero_documento, genero, telefono, correo, horario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const [result] = await connection.query(query, [
                userId,
                nombres,
                apellidos,
                fotoPath || null,
                tipo_documento,
                numero_documento,
                genero ,
                telefono ,
                correo ,
                horario || null
            ]);
    
            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error creando el personal administrativo');
            }
    
            await connection.commit();
            return {
                success: true,
                personalId: result.insertId,
                nombres,
                apellidos,
                userId
            };
        } catch (error) {
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error en el registro del personal administrativo', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }
    

    // Método para obtener todos los personal administrativo activos
    async getActivePersonal() {
        try {
            const query = `
                SELECT p.*, u.username, u.rol
                FROM PersonalAdministrativo p
                JOIN Usuario u ON p.usuario_id = u.id
            `;

            const [result] = await mysql.query(query);

            if (result.length === 0) {
                throw boom.notFound('No hay personal administrativo activo');
            }

            return { success: true, personal: result };
        } catch (error) {
            throw this.handleError(error, 'Ocurrió un error al obtener el personal administrativo');
        }
    }

    // Método para buscar personal administrativo por número de documento
    async findByDocumento(numero_documento) {
        const query = `
            SELECT p.*, u.username, u.rol
            FROM PersonalAdministrativo p
            JOIN Usuario u ON p.usuario_id = u.id
            WHERE p.numero_documento = ?;
        `;

        try {
            const [result] = await mysql.query(query, [numero_documento]);

            if (result.length === 0) {
                throw boom.notFound('Personal administrativo no encontrado');
            }

            return { success: true, personal: result[0] };
        } catch (error) {
            throw this.handleError(error, 'Ocurrió un error al buscar el personal administrativo');
        }
    }

    // Método para actualizar los datos del personal administrativo
    async updatePersonal(documento, updates) {
        const personal = await this.findByDocumento(documento);

        if (!personal.success) {
            throw boom.notFound(`Personal administrativo con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            const values = [];
            const fields = [];
            const items = {
                foto: 'foto',
                telefono: 'telefono',
                correo: 'correo',
                horario: 'horario'
            };


            // Verificación de cambio de imagen
            if (updates.foto && personal.personal.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', personal.personal.foto);
                try {
                    if (fs.existsSync(oldFotoPath)) {
                        fs.unlinkSync(oldFotoPath); // Eliminación de imagen antigua
                    }
                } catch (error) {
                    throw boom.badImplementation('Error eliminando imagen antigua.');
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

            values.push(personal.personal.id);

            const query = `
                UPDATE PersonalAdministrativo
                SET ${fields.join(', ')}
                WHERE id = ?;
            `;

            const [result] = await connection.query(query, values);

            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error actualizando los datos del personal administrativo.');
            }

            // Actualizar usuario si es necesario
            if (updates.username || updates.correo) {
                const userService = new UserService();
                const userUpdates = {};

                if (updates.username) userUpdates.username = updates.username;
                if (updates.correo) userUpdates.correo = updates.correo;

                const userResponse = await userService.updateUser(personal.personal.usuario_id, userUpdates);
                if (!userResponse.success) {
                    throw boom.badImplementation('Error actualizando el usuario relacionado.');
                }
            }

            // Confirmar la transacción
            await connection.commit();

            return {
                success: true,
                message: 'Personal administrativo actualizado correctamente',
                personalId: personal.personal.id,
            };
        } catch (error) {
            await connection.rollback(); // Revertir cambios en caso de error
            if (!error.isBoom) {
                throw boom.badImplementation('Error durante la actualización del personal administrativo.', error);
            }
            throw error;
        } finally {
            connection.release(); // Liberar la conexión
        }
    }

    // Método para eliminar el personal administrativo
    async deletePersonal(documento) {
        const personal = await this.findByDocumento(documento); // Busca el personal por documento
        
        if (!personal.success) {
            throw boom.notFound(`Personal administrativo con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            // Eliminar el personal
            const deletePersonalQuery = `
                DELETE FROM PersonalAdministrativo WHERE numero_documento = ?;
            `;
            const [deletePersonalResult] = await connection.query(deletePersonalQuery, [documento]);

            if (deletePersonalResult.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando los datos del personal administrativo.');
            }

            // Eliminar el usuario relacionado con el personal
            const deleteUsuarioQuery = `
                DELETE FROM Usuario WHERE id = ?;
            `;
            const [deleteUsuarioResult] = await connection.query(deleteUsuarioQuery, [personal.personal.usuario_id]);

            if (deleteUsuarioResult.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando el usuario relacionado.');
            }

            await connection.commit();
            return {
                success: true,
                message: 'Personal administrativo y usuario eliminados correctamente.'
            };
        } catch (error) {
            await connection.rollback();
            if (!error.isBoom) {
                throw boom.badImplementation('Error durante la eliminación del personal administrativo.', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }

    // Método para manejar errores
    handleError(error, defaultMessage) {
        if (!error.isBoom) {
            throw boom.badImplementation(defaultMessage, error);
        }
        throw error;
    }
}

module.exports = PersonalAdministrativoService;
