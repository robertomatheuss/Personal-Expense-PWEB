const db = require('../infra/database');

class AccountService {
    constructor() {
        this.Account = db.models.Account;
        this.Transaction = db.models.Transaction;
    }

    async create(accountData) {
        // Validação simples do nome
        if (accountData.name) {
            accountData.name = accountData.name.trim();
            if (accountData.name.length < 2) {
                throw new Error("O nome deve ter pelo menos 2 caracteres.")
            }
        } else {
            throw new Error("O nome é obrigatório.")
        }

        // Define saldo 0 se não for informado
        if (accountData.initialBalance === undefined || accountData.initialBalance === '') {
            accountData.initialBalance = 0.0;
        }

        return this.Account.create({
            name: accountData.name,
            initialBalance: accountData.initialBalance
        });
    }

    async findAll() {
        return this.Account.findAll({
            attributes: ['id', 'name', 'initialBalance'],
            order: [['name', 'ASC']]
        });
    }

    async findById(id) {
        return this.Account.findByPk(id);
    }

    async update(id, updateData) {
        const account = await this.Account.findByPk(id);

        if (!account) {
            return null;
        }

        if (updateData.name) {
            updateData.name = updateData.name.trim();
            if (updateData.name.length < 2) {
                throw new Error("O nome deve ter pelo menos 2 caracteres.")
            }
        }

        return account.update({
            name: updateData.name || account.name,
            initialBalance: updateData.initialBalance !== undefined ? updateData.initialBalance : account.initialBalance
        });
    }

    // --- MUDANÇA AQUI ---
    async delete(id) {
        // 1. Primeiro, excluímos todas as transações vinculadas a este usuário/conta
        await this.Transaction.destroy({
            where: { accountId: id }
        });

        // 2. Agora que não há mais dependências, podemos excluir a conta
        return this.Account.destroy({
            where: { id: id }
        });
    }
}

module.exports = new AccountService();