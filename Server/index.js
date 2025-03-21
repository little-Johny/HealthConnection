const express = require('express');
require('express-async-errors'); // Se cargará globalmente si se usa en rutas
const cors = require('cors');
const path = require('path');
const sequelize = require('./libs/sequelize');

const {
    logError, 
    errorHandler, 
    boomErrorHandler
} = require('./middlewares/error.handler');
/* const routerApi = require('./routers'); */

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Servir archivos estáticos de la carpeta "uploads"
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'))); // Ruta absoluta

/* routerApi(app); */

// Implementación de middlewares
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

// Función para probar la conexión a la base de datos con Sequelize
const testDbConnection = async () => {
    try {
        await sequelize.authenticate(); // Verifica la conexión con Sequelize
        console.log('☑️  Database connection successful.');
    } catch (error) {
        console.error(`❌ Error connecting to database: ${error.message}`);
        throw new Error('Database connection failed.');
    }
};

// Iniciar el servidor
(async () => {
    try {
        await testDbConnection(); // Verificar conexión con la base de datos
        
        // Opcional: sincronizar modelos (solo en desarrollo, evita usar en producción)
        // await sequelize.sync({ force: false }); 

        app.listen(port, () => {
            console.log(`🚀 Server is running on port: ${port}`);
        });
    } catch (error) {
        console.error(`❌ Failed to start the server: ${error.message}`);
        process.exit(1); // Terminar proceso si no hay conexión a la base de datos
    }
})();

// Manejar errores no atrapados (opcional, pero recomendable)
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1); // Finaliza el proceso de forma controlada
});
