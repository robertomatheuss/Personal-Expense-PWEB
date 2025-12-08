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
            unique: true, // Garante que não existam dois "Wylker"
        },
        initialBalance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        }
        // REMOVIDO: type, categoryId
    }, {
        tableName: 'Accounts',
        timestamps: true,
    });

    Account.associate = (models) => {
        // Uma Conta (Pessoa) tem várias transações
        Account.hasMany(models.Transaction, {
            foreignKey: 'accountId',
            as: 'transactions'
        });
    };

    return Account;
};