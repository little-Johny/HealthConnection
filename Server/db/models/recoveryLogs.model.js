const { DataTypes, Model } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const RECOVERY_LOG_TABLE = 'recovery_log';

const RecoveryLogSchema = {
    id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    requestedAt: {
        field: 'requested_at',
        allowNull: false,
        type: DataTypes.DATE,
    },
    ipAddress: {
        field: 'ip_address',
        allowNull: true,
        type: DataTypes.STRING,
    },
    userAgent: {
        field: 'user_agent',
        allowNull: true,
        type: DataTypes.STRING,
    },
};

class RecoveryLog extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });
    };

    static config(sequelize) {
        return {
            sequelize,
            tableName: RECOVERY_LOG_TABLE,
            modelName: 'RecoveryLog',
            timestamps: false,
        };
    };
};

module.exports = { RECOVERY_LOG_TABLE, RecoveryLog, RecoveryLogSchema };