const AccountService = require("../services/AccountService");
const CategoryService = require("../services/CategoryService");

class AccountController {
    async renderAccountView(req, res) {
        try {
            const filterType = req.query.type;
            let accounts;

            if (filterType && AccountService.validTypes.includes(filterType)) {
                accounts = await AccountService.findByType(filterType);
            } else {
                accounts = await AccountService.findAll();
            }

            const accountTypes = AccountService.validTypes;

            res.render('layout/main', {
                title: 'Gestão de Contas',
                accounts: accounts,
                accountTypes: accountTypes,
                pageType: 'account',
                currentFilter: filterType || ''
            })
        } catch (error) {
            console.error('Erro ao renderizar view de contas:', error.message);
            res.status(500).send('Erro interno ao carregar a página: ' + error.message);
        }
    }

    async getAllAccounts(req, res) {
        try {
            const accounts = await AccountService.findAll();
            return res.status(200).json({ data: accounts });
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message });
        }
    }

    async createAccount(req, res) {
        try {
            const { name, initialBalance, type } = req.body;

            if (!name) {
                return res.status(400).json({ error: true, message: "Erro de validação: O nome é obrigatório." });
            }

            const newAccount = await AccountService.create({ name, initialBalance, type });

            return res.status(201).json({ message: "Conta criada com sucesso.", data: newAccount });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: true, message: "Erro de validação: Já existe uma conta com esse nome." });
            }
            return res.status(400).json({ error: true, message: error.message });
        }
    }
    
    async updateAccount(req, res) {
        try {
            const {id} = req.params;
            const updateData = req.body;

            const updatedAccount = await AccountService.update(id, updateData);

            if (!updatedAccount) {
                return res.status(404).json({ error: true, message: `Conta com ID ${id} não encontrada.` });
            }

            return res.status(200).json({ message: "Conta atualizada com sucesso.", data: updatedAccount });
        } catch (error) {
            return res.status(400).json({ error: true, message: error.message });
        }
    }

    async deleteAccount(req, res) {
        try {
            const {id} = req.params;

            await AccountService.delete(id);
            return res.status(200).send();
        }
        catch (error) {
            return res.status(500).json({ error: true, message: error.message });
        }
    }
}

module.exports = new AccountController();