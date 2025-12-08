const AccountService = require("../services/AccountService");
const TransactionService = require("../services/TransactionService");

class HomeController {
    async renderHome(req, res) {
        try {
            const [accounts, transactions] = await Promise.all([
                AccountService.findAll(),
                TransactionService.findAll()
            ]);

            const totalInitial = accounts.reduce((acc, account) => acc + Number(account.initialBalance), 0);

            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(t => {
                const val = Number(t.value);
                if (t.transactionType === 'INCOME') {
                    totalIncome += val;
                } else {
                    totalExpense += val;
                }
            });

            const currentBalance = totalInitial + totalIncome - totalExpense;

            const recentTransactions = transactions.slice(0, 5);

            res.render('layout/main', {
                title: 'Dashboard',
                pageType: 'home',
                
                totalBalance: currentBalance,
                totalIncome: totalIncome,
                totalExpense: totalExpense,
                
                accountsCount: accounts.length,
                recentTransactions: recentTransactions
            });

        } catch (error) {
            console.error('Erro no Dashboard:', error);
            res.render('layout/main', {
                title: 'Erro',
                pageType: 'error',
                message: 'Erro ao carregar dashboard.'
            });
        }
    }
}

module.exports = new HomeController();