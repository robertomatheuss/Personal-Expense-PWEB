const TransactionService = require("../services/TransactionService");
const AccountService = require("../services/AccountService");
const CategoryService = require("../services/CategoryService");

class TransactionController {
    
    async renderTransactionView(req, res) {
        try {
            const transactions = await TransactionService.findAll();
            const accounts = await AccountService.findAll();
            const categories = await CategoryService.findAll();

            res.render('layout/main', {
                title: 'Transações',
                pageType: 'transaction',
                transactions: transactions,
                accounts: accounts,
                categories: categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar transações.");
        }
    }

    async createTransaction(req, res) {
        try {
            await TransactionService.create(req.body);
            return res.status(201).json({ message: "Transação salva com sucesso." });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateTransaction(req, res) {
        try {
            await TransactionService.update(req.params.id, req.body);
            return res.status(200).json({ message: "Transação atualizada." });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteTransaction(req, res) {
        try {
            await TransactionService.delete(req.params.id);
            return res.status(200).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TransactionController();