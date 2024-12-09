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
                personalId: result.insertId,
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
    

    // Método para obtener todos los personal administrativo activos
    async getActivePersonal() {
        try {
            const query = `
                SELECT 
                    p.id AS administrativoId,p.nombres, p.apellidos, p.foto, p.tipo_documento, p.numero_documento, p.genero, p.telefono, p.correo, p.horario, p.fecha_contratacion, u.username, u.rol
                FROM PersonalAdministrativo p
                JOIN Usuario u ON p.usuario_id = u.id
                WHERE u.activo = true
            `;

            const [result] = await mysql.query(query);

            if (result.length === 0) {
                throw boom.notFound('No hay personal administrativo activo');
            }

            return { personal: result };
        } catch (error) {
            throw this.handleError(error, 'Ocurrió un error al obtener el personal administrativo');
        }
    }

    // Método para buscar personal administrativo por número de documento
    async findByDocumento(documento) {
        try {
            const query = `
                SELECT 
                    p.*, u.username, u.rol
                FROM PersonalAdministrativo p
                JOIN Usuario u ON p.usuario_id = u.id
                WHERE p.numero_documento = ?;
            `;
            const [result] = await mysql.query(query, [documento]);

            if (result.length === 0) {
                throw boom.notFound('Personal administrativo no encontrado');
            }

            return  result[0] ;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            if (!id) {
                throw boom.badRequest('El ID del usuario es requerido.');
            }
    
            // Consultar al usuario por ID
            const userQuery = `
                SELECT id AS usuario_id, username, rol
                FROM Usuario
                WHERE id = ?;
            `;
            const [userResult] = await mysql.query(userQuery, [id]);
    
            if (userResult.length === 0) {
                throw boom.notFound(`Usuario con ID ${id} no encontrado.`);
            }
    
            const user = userResult[0];
    
            // Buscar información del paciente relacionado al usuario
            const personalQuery = `
                SELECT 
                    p.*, u.username, u.rol
                FROM PersonalAdministrativo p
                JOIN Usuario u ON p.usuario_id = u.id
                WHERE u.id = ?;
            `;
            const [personalResult] = await mysql.query(personalQuery, [id]);
    
            if (personalResult.length === 0) {
                throw boom.notFound(`No se encontró un personal relacionado con el usuario ID ${id}.`);
            }
    
            return {
                usuario: {
                    id: user.usuario_id,
                    username: user.username,
                    rol: user.rol,
                },
                personal: personalResult[0],
            };
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar los datos del personal administrativo
    async updatePersonal(documento, updates) {
        if (!documento) {
            throw boom.badRequest('El documento es requerido para actualizar personal.');
        }
    
        const personal = await this.findByDocumento(documento);
    
        if (!personal) {
            throw boom.notFound(`Personal administrativo con documento ${documento} no encontrado.`);
        }
    
        const connection = await mysql.getConnection();
        await connection.beginTransaction();
    
        try {
            const values = [];
            const fields = [];
            const validFields = {
                foto: 'foto',
                telefono: 'telefono',
                correo: 'correo',
                horario: 'horario',
            };
    
            // Verificación de cambio de imagen
            if (updates.foto && personal.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', personal.foto);
                if (fs.existsSync(oldFotoPath)) {
                    fs.unlinkSync(oldFotoPath); // Eliminación de imagen antigua
                }
            }
    
            // Construcción dinámica de campos para actualizar
            for (let key in updates) {
                if (validFields[key]) {
                    fields.push(`${validFields[key]} = ?`);
                    values.push(updates[key]);
                }
            }
    
            if (fields.length === 0) {
                throw boom.badRequest('No hay campos válidos para actualizar.');
            }
    
            values.push(personal.id);
    
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
            if (updates.correo) {
                const userService = new UserService();
                const userUpdates = {};
    
                if (updates.correo) userUpdates.correo = updates.correo;
    
                const userResponse = await userService.updateUser(personal.usuario_id, userUpdates);
                if (!userResponse.success) {
                    throw boom.badImplementation('Error actualizando el usuario relacionado.');
                }
            }
    
            await connection.commit();
            return {
                personalId: personal.id,
                updatedFields: Object.keys(updates),
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    

    //metodfo para desactivar usuario y administrativo
    async deactivatePersonal(documento) {
        const personal = await this.findByDocumento(documento);
        const userService = new UserService();
        await userService.deactivateUser(personal.usuario_id);

        return {
            personalId: personal.id,
            usuarioId: personal.usuario_id,
        };
    }


    // Método para eliminar el personal administrativo
    async deletePersonal(documento) {
        const personal = await this.findByDocumento(documento); // Busca el personal por documento
        
        if (!personal) {
            throw boom.notFound(`Personal administrativo con documento ${documento} no encontrado.`);
        }

        const connection = await mysql.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(`DELETE FROM PersonalArministrativo WHERE numero_documento = ?;`, [documento]);
            await connection.query(`DELETE FROM Usuario WHERE id = ?;`, [personal.usuario_id]);

            await connection.commit();
            return {
                pacienteId: personal.id,
                usuarioId: personal.usuario_id,
            };
        } catch (error) {
            await connection.rollback();
            
            throw error;
        } finally {
            connection.release();
        }
    }

}

module.exports = PersonalAdministrativoService;
