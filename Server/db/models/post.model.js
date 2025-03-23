const { DataTypes, Model, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const POST_TABLE = 'post';

const  PostsSchema = {
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
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    content: {
        allowNull: true,
        type: DataTypes.TEXT,
    },
    image: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    reatedAt: {
        field: 'created_at',
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        field: 'updated_at',
        allowNull: true,
        type: DataTypes.DATE,
    },
    deletedAt: {
        field: 'deleted_at',
        allowNull: true,
        type: DataTypes.DATE,
    },
};

class Post extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });
    };

    static config(sequelize) {
        return {
            sequelize,
            tableName: POST_TABLE,
            modelName: 'Post',
            timestamps: true,
        };
    };
};



