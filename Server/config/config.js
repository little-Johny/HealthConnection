require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT || 5432,
    jwtSecret: process.env.JWT_SECRET,
    recoverySecret: process.env.JWT_RECOVERY_PASS_SECRET,
    mailerUser: process.env.MAILER_USER,
    mailerPassword: process.env.MAILER_PASSWORD,
};

module.exports = config;
