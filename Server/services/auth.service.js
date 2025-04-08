const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
};

module.exports = AuthService;