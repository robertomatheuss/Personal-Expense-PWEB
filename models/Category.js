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
            unique: true,    
        },
        type: {
            type: DataTypes.ENUM('fixed', 'variable'), 
            allowNull: false,
            defaultValue: 'variable',
        }
    }, {
        tableName: 'Categories', 
        timestamps: true,        
    });

    Category.associate = (models) => {
        Category.hasMany(models.Transaction, {
            foreignKey: 'categoryId', 
            as: 'categoryTransactions' 
        });
    };

    return Category;
};