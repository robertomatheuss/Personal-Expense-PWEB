const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transactionType: {
            type: DataTypes.ENUM('INCOME', 'EXPENSE'),
            allowNull: false,
            defaultValue: 'EXPENSE'
        },
        recurrence: {
            type: DataTypes.ENUM('FIXED', 'VARIABLE'),
            allowNull: false,
            defaultValue: 'VARIABLE'
        }
    }, {
        tableName: 'Transactions',
        timestamps: true,
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Account, { foreignKey: 'accountId', as: 'account' });
        Transaction.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    };

    return Transaction;
};