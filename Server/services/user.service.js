const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');


const mysql = require('../config/db');


class UserService {
    async registerUser (data) {
        const { username, password, correo, rol, activo } = data;

        try {
            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Consulta SQL parametrizada
            const query = `
                INSERT INTO Usuario (username, password, correo, rol, activo) 
                VALUES (?, ?, ?, ?, ?);
            `;

            const [result] = await mysql.query(query, [
                username,
                hashedPassword,
                correo,
                rol,
                activo == true,
            ]);

            // Validación del resultado
            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error creando el usuario');
            }

            // Retorno del éxito
            return { 
                success: true, 
                userId: 
                    result.insertId, 
                    username, 
                    rol, // Retorna datos del usuario creado
            };
        } catch (error) {
            // Manejo de errores
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error; // Si ya es un error tipo Boom, se re-lanza
        }
    };

    async login(username, password) {
        try {
            // Busca el usuario por nombre de usuario
            const user = await this.findByUsername(username);
            if (!user) {
                throw boom.unauthorized('Usuario no encontrado.');
            }
    
            // Verifica si la contraseña coincide
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw boom.unauthorized('Contraseña incorrecta.');
            }
    
            // Genera el token JWT con `userId` y `role`
            const token = jwt.sign(
                { userId: user.id, role: user.rol }, // Cambiado de `user.role` a `user.rol`
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            // Devuelve la respuesta con el token y datos adicionales
            return {
                success: true,
                token,
                userId: user.id,      // Incluido explícitamente el `userId`
                role: user.rol,       // Incluido explícitamente el `role`
                message: 'Inicio de sesión exitoso.',
            };
        } catch (error) {
            // Manejar errores en la base de datos o generales
            if (!error.isBoom) {
                console.error('Error inesperado en el login:', error);
                throw boom.badImplementation('Ocurrió un error en el proceso de login.');
            }
            throw error; // Re-lanzar errores gestionados (Boom)
        }
    }
    

    async findOne(id) {
        try {
            const query =`
                SELECT id, username, password, rol
                FROM Usuario
                WHERE id = ?;
            `;

            const [result] = await mysql.query(query, [id]);
            // Validar si el usuario fue encontrado
            if (result.length === 0) {
                throw boom.notFound('User not found');
            }
    
            const user = result[0]; // Tomar la primera fila
    
            return { 
                success: true, 
                userId: user.id,
                username: user.username,
                rol: user.rol,
                active: user.activo,
            };
        } catch (error) {
            // Manejar errores en la base de datos
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    }

    async findByRol(rol) {
        try {
            let tableName;
            
            // Determinar la tabla asociada al rol
            switch (rol) {
                case 'administrador':
                    tableName = 'PersonalAdministrativo';  // Tabla para administradores
                    break;
                case 'asistente':
                    tableName = 'PersonalAdministrativo';  // Tabla para asistentes 
                    break;
                case 'doctor':
                    tableName = 'Doctor';  // Tabla para doctores
                    break;
                case 'paciente':
                    tableName = 'Paciente';  // Tabla para pacientes
                    break;
                default:
                    throw boom.badRequest('Rol no válido');  // Si el rol no es válido
            }
    
            // Crear la consulta SQL dinámica
            const query = `
                SELECT u.id, u.username, u.rol, t.*
                FROM Usuario u
                JOIN ${tableName} t ON u.id = t.usuario_id
                WHERE u.rol = ?;
            `;
    
            // Ejecutar la consulta
            const [result] = await mysql.query(query, [rol]);
    
            // Validar si se encontraron usuarios con el rol especificado
            if (result.length === 0) {
                throw boom.notFound(`No users found with the role: ${rol}`);
            }
    
            // Retornar los resultados
            return {
                success: true,
                users: result,  // Retornar todos los usuarios encontrados
            };
        } catch (error) {
            // Manejo de errores
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    }
    

    async findByUsername(username) {
        try {
            const query = `
                SELECT id, username, password, rol 
                FROM Usuario 
                WHERE username = ?;
            `;
            const [result] = await mysql.query(query, [username]);

            if (result.length === 0) {
                return null; // Si no se encuentra el usuario, retorna null
            }

            const user = result[0];

            return { 
                success: true, 
                id: user.id,
                username: user.username,
                password: user.password,
                rol: user.rol,
            };
        } catch (error) {
            // Manejar errores en la base de datos
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    };

    async find() {
        try {
            const query = `
                SELECT id, username, correo, rol, activo
                FROM Usuario;
            `;
    
            const [result] = await mysql.query(query);
    
            if (result.length === 0) {
                throw boom.notFound('No users found');
            }
    
            return {
                success: true,
                users: result,
            };
        } catch (error) {
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    }
    

    async updateUser(id, updates) {
        // Buscar al usuario
        const user = await this.findOne(id);
    
        if (!user) {
            throw boom.notFound(`Usuario con id ${id} no encontrado`);
        }
    
        try {

            const items = {
                username: 'username',
                correo: 'correo'
            };

            const fields = [];
            const values = [];
    
            // Actualizar campos si se proporcionan
            for(let key in updates) {
                if (items[key]) {
                    fields.push(`${items[key]} = ?`);
                    values.push(updates[key]);
                }
            }
    
            // Si no hay campos válidos para actualizar
            if (fields.length === 0) {
                throw boom.badRequest('No hay campos válidos para actualizar.');
            }
    
            // Agregar el ID al final de los valores
            values.push(id);
    
            // Consulta SQL para actualizar el usuario
            const query = `
                UPDATE Usuario
                SET ${fields.join(', ')}
                WHERE id = ?;
            `;
    
            const [result] = await mysql.query(query, values);
    
            // Validación de que la actualización fue exitosa
            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error actualizando usuario');
            }
    
            // Retorno del éxito
            return {
                success: true,
                id: user.id,
                updates: updates, // Devolvemos los datos actualizados
            };
    
        } catch (error) {
            // Manejo de errores
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    }
    
    
    async deactivateUser(id) {
        try {
            const query = `
                UPDATE Usuario
                SET activo = !activo
                WHERE id = ?;
            `;
    
            const [result] = await mysql.query(query, [id]);
    
            // Verifica si se realizó la actualización correctamente
            if (result.affectedRows === 0) {
                throw boom.notFound('El usuario no fue encontrado o ya está inactivo.');
            }
    
            return {
                success: true,
                message: 'Usuario desactivado correctamente.',
            };
        } catch (error) {
            // Manejo de errores
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    };

    async deleteUser(id) {
        const user = await this.findOne(id);

        if (!user) {
        throw boom.notFound(`User with ID ${id} not found`);
        }

        try {
            const query = `
                DELETE FROM Usuario
                WHERE id = ?
            `;
            const [result] = await mysql.query(query, [id]);
            
            if (result.affectedRows === 0) {
                throw boom.badImplementation('Error eliminando usuario');
            }

            return {
                success: true,
                message: 'Usuario eliminado correctamente.',
            };
        } catch (error) {
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error en la base de datos', error);
            }
            throw error;
        }
    }
}

module.exports = UserService;
