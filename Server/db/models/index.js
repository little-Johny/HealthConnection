const { User, UseSchema, UserSchema } = require('./user.model');

function setUpModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
}

module.exports = setUpModels;