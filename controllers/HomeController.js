const AccountService = require("../services/AccountService");
const TransactionService = require("../services/TransactionService");

class HomeController {
    async renderHome(req, res) {
        try {
            // 1. Buscas Paralelas (Mais rápido)
            const [accounts, transactions] = await Promise.all([
                AccountService.findAll(),
                TransactionService.findAll()
            ]);

            // 2. Cálculos
            // Soma do saldo inicial de todos os usuários (Wylker, Eduarda, etc)
            const totalInitial = accounts.reduce((acc, account) => acc + Number(account.initialBalance), 0);

            let totalIncome = 0;
            let totalExpense = 0;

            // Percorre transações para somar
            transactions.forEach(t => {
                const val = Number(t.value);
                if (t.transactionType === 'INCOME') {
                    totalIncome += val;
                } else {
                    totalExpense += val;
                }
            });

            // Saldo Atual = O que tinha no inicio + O que entrou - O que saiu
            const currentBalance = totalInitial + totalIncome - totalExpense;

            // 3. Pegar apenas as 5 últimas transações para exibir na tabela
            const recentTransactions = transactions.slice(0, 5);

            // 4. Renderizar
            res.render('layout/main', {
                title: 'Dashboard',
                pageType: 'home',
                
                // Dados calculados
                totalBalance: currentBalance,
                totalIncome: totalIncome,
                totalExpense: totalExpense,
                
                // Dados para listas
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