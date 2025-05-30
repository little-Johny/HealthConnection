const { Strategy } = require('passport-local');
const AuthService = require('../../../services/auth.service');

const service = new AuthService();

const LocalStrategy = new Strategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    async (username, password, done) => {
        try {
            const user = await service.login(username, password);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    },
);

module.exports = LocalStrategy;
