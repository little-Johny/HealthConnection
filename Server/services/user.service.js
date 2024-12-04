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
                activo
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
            // Buscar al usuario por su username
            const userResponse = await this.findByUsername(username);
            
            if (!userResponse.success) {
                throw boom.unauthorized('Usuario no encontrado.');
            }
    
            // Extrae solo lo necesario de userResponse
            const { username, rol, userId } = userResponse;
    
            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, userResponse.password);
            if (!passwordMatch) {
                throw boom.unauthorized('Contraseña incorrecta.');
            }
    
            // Generar el token JWT
            const token = jwt.sign(
                { userId, role: rol },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' } // El tiempo puede ajustarse según tus necesidades
            );
    
            return {
                token,
                role: rol,
                message: 'Inicio de sesión exitoso.',
            };
        } catch (error) {
            // Manejo de errores inesperados
            if (!error.isBoom) {
                throw boom.badImplementation('Ocurrió un error inesperado durante el inicio de sesión.', error);
            }
            throw error;
        }
    };
    

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
                active: user.active,
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
        const user = await this.findById(id);
    
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
