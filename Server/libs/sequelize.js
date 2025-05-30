const { Sequelize } = require('sequelize');
const config = require('../config/config');
const setUpModels = require('../db/models/index');

// URL de conexion
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// nueva instancia de sequelize
const sequelize = new Sequelize(URL, {
    // que base de datos se usara
    dialect: 'postgres',
    // nos mostrara el log de cada consulta en la consola
    logging: (msg) => console.log(`[Sequelize]: ${msg}`),
    pool: {
        max: 10, // Número máximo de conexiones en el pool
        min: 2, // Número mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo en milisegundos para intentar obtener una conexión antes de lanzar error
        idle: 10000, // Tiempo máximo en milisegundos que una conexión puede estar inactiva antes de ser liberada
    },
});

setUpModels(sequelize);
/* sequelize.sync(); */
(async () => {
    try {
        await sequelize.authenticate();
        console.log('☑️  Successfully connected to the database!');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
})();

module.exports = sequelize;
