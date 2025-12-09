const db = require('../infra/database');

class TransactionService {
    constructor() {
        this.Transaction = db.models.Transaction;
        this.Account = db.models.Account;
        this.Category = db.models.Category;
    }

    async findAll() {
        return this.Transaction.findAll({
            include: [
                { model: this.Account, as: 'account', attributes: ['id', 'name'] },
                { model: this.Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }

    async create(data) {
        const transactionDate = new Date(data.date);
        const today = new Date();

        if (transactionDate.getTime() > today.getTime()) {
            throw new Error("A data da transação não pode ser uma data futura.");
        }
        if (!data.accountId) throw new Error("Selecione uma Conta/Usuário.");
        if (!data.categoryId) throw new Error("Selecione uma Categoria.");
        if (!data.value || data.value <= 0) throw new Error("O valor deve ser maior que 0.");
        if (!data.date) throw new Error("A data é obrigatória.");
        
        if (!['INCOME', 'EXPENSE'].includes(data.transactionType)) throw new Error("Tipo de transação inválido.");
        
        if (!['FIXED', 'VARIABLE'].includes(data.recurrence)) throw new Error("Recorrência inválida.");

        return this.Transaction.create(data);
    }

    async update(id, data) {
        const transactionDate = new Date(data.date);
        const today = new Date();
        if (transactionDate.getTime() > today.getTime()) {
            throw new Error("A data da transação não pode ser uma data futura.");
        }
        if (!data.accountId) throw new Error("Selecione uma Conta/Usuário.");
        if (!data.categoryId) throw new Error("Selecione uma Categoria.");
        if (!data.value || data.value <= 0) throw new Error("O valor deve ser maior que 0.");
        if (!data.date) throw new Error("A data é obrigatória.");
        
        const transaction = await this.Transaction.findByPk(id);
        if (!transaction) return null;
        return transaction.update(data);
    }

    async delete(id) {
        return this.Transaction.destroy({ where: { id } });
    }
}

module.exports = new TransactionService();