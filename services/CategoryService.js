const db = require('../infra/database');

class CategoryService {
    constructor() {
        this.Category = db.models.Category;
        this.Transaction = db.models.Transaction;
    }

    // ... create, findAll, update (mantém igual) ...
    async create(data) {
        // ... mantém código existente
        return this.Category.create(data);
    }

    async findAll() {
        return this.Category.findAll({ order: [['name', 'ASC']] });
    }

    async update(id, data) {
        // ... mantém código existente
        const category = await this.Category.findByPk(id);
        if (!category) throw new Error("Categoria não encontrada.");
        return category.update(data);
    }

    // --- MUDANÇA AQUI ---
    async delete(id) {
        // 1. Exclui todas as transações vinculadas a esta categoria (Limpeza)
        await this.Transaction.destroy({ 
            where: { categoryId: id } 
        });

        // 2. Agora exclui a categoria
        return this.Category.destroy({ 
            where: { id: id } 
        });
    }
}

module.exports = new CategoryService();