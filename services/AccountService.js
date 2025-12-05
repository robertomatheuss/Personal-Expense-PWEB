const db = require('../infra/database');

class AccountService {
    constructor() {
        this.Account = db.models.Account;
        this.Transaction = db.models.Transaction;
        this.validTypes = ['fixed', 'variable'];
    }

    async create(accountData) {
        if (accountData.name) {
            accountData.name = accountData.name.trim();
            if (accountData.name.length < 3) {
                throw new Error("O nome da conta deve ter pelo menos 3 caracteres.")
            }
        } else {
            throw new Error("O nome da conta é obrigatório.")
        }

        if (accountData.type && !this.validTypes.includes(accountData.type)) {
            throw new Error("Tipo de conta inválido. Deve ser 'fixed' ou 'variable'.")
        }

        if (accountData.initialBalance === undefined || accountData.initialBalance === '') {
            accountData.initialBalance = 0.0;
        }
        
        return this.Account.create(accountData);
    }

    async findAll() {
        return this.Account.findAll({
            attributes: ['id', 'name', 'type', 'initialBalance'],
            order: [['name', 'ASC']]
        });
    }

    async findByType(type) {
        if (!this.validTypes.includes(type)) {
            throw new Error("Tipo de filtro inválido.")
        }

        return this.Account.findAll({
            where: { type: type },
            attributes: ['id', 'name', 'type', 'initialBalance'],
            order: [['name', 'ASC']]
        })
    }

    async findById(id) {
        return this.Account.findByPk(id)
    }

    async update(id, updateData) {
        const account = await this.Account.findByPk(id);

        if (!account) {
            return null
        }

        if (updateData.name) {
            updateData.name = updateData.name.trim();
            if (updateData.name.length < 3) {
                throw new Error("O nome da conta deve ter pelo menos 3 caracteres.")
            }
        }

        if (updateData.type && !this.validTypes.includes(updateData.type)) {
            throw new Error("Tipo de conta inválido");
        }

        return account.update(updateData);
    }

    async delete(id) {
        const associatedTransactions = await this.Transaction.count({
            where: { accountId: id }
        });
        if (associatedTransactions > 0) {
            throw new Error(`Não é possível excluir esta conta. Existem ${associatedTransactions} transações associadas a ela.`);
        }

        return this.Account.destroy({
            where: { id: id }
        })
    }
}

module.exports = new AccountService();