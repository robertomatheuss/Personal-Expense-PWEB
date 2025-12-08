const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Apenas define se é Entrada ou Saída (para filtrar o select na tela de transações)
        type: {
            type: DataTypes.ENUM('INCOME', 'EXPENSE'), 
            allowNull: false,
            defaultValue: 'EXPENSE'
        }
        // REMOVIDO: recurrence
    }, {
        tableName: 'Categories',
        timestamps: true,
    });

    Category.associate = (models) => {
        Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
    };

    return Category;
};