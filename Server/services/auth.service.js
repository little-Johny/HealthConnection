const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { models } = require('./../libs/sequelize');
const config = require('./../config/config');
const UserService = require('./user.service');
const userService = new UserService();

class AuthService {
    async login(username, password) {
        const user = await userService.findByUsername(username);
        if (!user) {
            throw boom.unauthorized();
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw boom.unauthorized();
        };
        delete user.dataValues.password;
        return user;
    };

    signToken(user) {
        const payload = {
            sub: user.id,
            role: user.role,
        };
    
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15m'});
    
        return {
            user,
            token,
        };
    };

    async sendMail(bodyMail) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: config.mailerUser,
                pass: config.mailerPassword,
            },
        });

        await transporter.sendMail(bodyMail);

        return {
            message: `Mail sent Correct.`
        }
    };

    async sendRecoveryPassword(email) {
        const user = await models.User.findOne({
            where: { email },
        });
        if (!user) {
            throw boom.unauthorized();   
        };
        const payload = {
            sub: user.id,
        };
        const token = jwt.sign(payload, config.recoverySecret, { expiresIn: '15m' });
        const link = `http://myfrontend.com/recovery?token=${token}`;
        await user.update({ recoveryToken: token });
        const mail = {
            from: config.mailerUser,
            to: `${user.email}`,
            subject: `Correo para recuperacion de contraseña`,
            html: `<b>Entra a este link para lograr recuperar tu contraseña → ${link}</b>` 
        };

        await this.sendMail(mail);
        return {
            message: `The recovery mail, has been sent`,
        };
    };

    async changePassword(token, newPassword) {
        try {
            const payload = jwt.verify(token, config.recoverySecret);
            const user = await userService.findOne(payload.sub);
            if (user.recoveryToken !== token) {
                throw boom.unauthorized();
            };
            const newPasswordHashed = await bcrypt.hash(newPassword, 10);
            await user.update({ recoveryToken: null, password: newPasswordHashed });
            return {
                message: 'password successfully changed',
            };
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw boom.unauthorized(`Invalid or expired token`);
            }
            throw error;
        }
    };
};

module.exports = AuthService;