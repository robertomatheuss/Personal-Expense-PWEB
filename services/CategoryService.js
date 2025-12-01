const db = require('../infra/database');

class CategoryService {
    constructor() {
        this.Category = db.models.Category;
        this.Transaction = db.models.Transaction;
        this.validTypes = ['fixed', 'variable']; 
    }

    async create(categoryData) {
        categoryData.name = categoryData.name.trim();
        if (categoryData.name.length < 3) {
            throw new Error("Category name must be at least 3 characters long.");
        }
        if (!this.validTypes.includes(categoryData.type)) {
            throw new Error(`Invalid category type. Must be one of: ${this.validTypes.join(', ')}`);
        }
        
        return this.Category.create(categoryData);
    }

    async findAll() {
        return this.Category.findAll({
            attributes: ['id', 'name', 'type']
        });
    }
    
    async findById(id) {
        return this.Category.findByPk(id);
    }

    async findByType(type) {
        if (!this.validTypes.includes(type)) {
            throw new Error(`Invalid category type filter. Must be one of: ${this.validTypes.join(', ')}`);
        }
        
        return this.Category.findAll({
            where: { type: type },
            attributes: ['id', 'name', 'type']
        });
    }

    async update(id, updateData) {
        const category = await this.Category.findByPk(id);

        if (!category) {
            return null;
        }

        updateData.name = updateData.name.trim();
        if (updateData.name.length < 3) {
            throw new Error("Category name must be at least 3 characters long.");
        }
        
        if (updateData.type && !this.validTypes.includes(updateData.type)) {
            throw new Error(`Invalid category type. Must be one of: ${this.validTypes.join(', ')}`);
        }

        return category.update(updateData);
    }

 
    async delete(id) {
        const associatedTransactions = await this.Transaction.count({
            where: { categoryId: id }
        });

        if (associatedTransactions > 0) {
            throw new Error(`Cannot delete category. There are ${associatedTransactions} associated transactions.`);
        }

        return await this.Category.destroy({
            where: { id: id }
        });        
    }
}

module.exports = new CategoryService();