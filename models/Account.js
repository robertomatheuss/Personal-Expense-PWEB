const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Account = sequelize.define('Account', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        initialBalance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        type: {
            type: DataTypes.ENUM('fixed', 'variable'),
            allowNull: false,
            defaultValue: 'variable'
        },
        // CORREÇÃO: Padronizado para categoryId (minúsculo) para bater com o Seed/Service
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Pode ser null se não tiver categoria
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    }, {
        tableName: 'Accounts',
        timestamps: true,
    });

    Account.associate = (models) => {
        Account.hasMany(models.Transaction, {
            foreignKey: 'accountId',
            as: 'accountTransactions'
        });

        // CORREÇÃO: models.Category (nome do model), e não models.CategoryID
        if (models.Category) {
            Account.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category'
            });
        }
    };

    return Account;
};