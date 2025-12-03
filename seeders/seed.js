const db = require('../infra/database');

const seedDatabase = async () => {
    try {
        const { Category, Account, Transaction } = db.models;

        const categoryCount = await Category.count();
        if (categoryCount === 0) {
            console.log('Seeding Categories...');
            await Category.bulkCreate([
                { name: 'Alimentação', type: 'Variável' },
                { name: 'Aluguel', type: 'Fixa' },
                { name: 'Salário', type: 'Fixa' },
                { name: 'Transporte', type: 'Variável' },
                { name: 'Lazer', type: 'Variável' },
            ]);
            console.log('Categories seeded successfully.');
        } else {
            console.log('Categories already exist, skipping seed.');
        }

        const accountCount = await Account.count();
        if (accountCount === 0) {
            console.log('Criando Contas Iniciais...');
            
            // Buscamos as categorias que ACABAMOS de garantir que existem
            // Usamos Promise.all para buscar todas de uma vez de forma eficiente
            const [catBanco, catInvest, catLazer] = await Promise.all([
                Category.findOne({ where: { name: 'Banco/Taxas' } }),
                Category.findOne({ where: { name: 'Investimentos' } }),
                Category.findOne({ where: { name: 'Lazer' } })
            ]);

            // Validação de segurança: Só cria se as categorias existirem
            if (catBanco && catInvest && catLazer) {
                await Account.bulkCreate([
                    { 
                        name: 'Conta Corrente (Nubank)', 
                        initialBalance: 1500.50, 
                        type: 'variable',
                        categoryId: catBanco.id // Vínculo direto e obrigatório
                    },
                    { 
                        name: 'Reserva de Emergência', 
                        initialBalance: 10000.00, 
                        type: 'fixed',
                        categoryId: catInvest.id // Vínculo direto e obrigatório
                    },
                    { 
                        name: 'Carteira (Dinheiro Vivo)', 
                        initialBalance: 250.00, 
                        type: 'variable',
                        categoryId: catLazer.id // Vínculo direto e obrigatório
                    },
                ]);
                console.log('Contas criadas com sucesso (todas vinculadas a categorias).');
            } else {
                console.error('ERRO: Não foi possível criar contas pois as categorias base não foram encontradas.');
            }
        } else {
            console.log('Contas já existem, pulando seed.');
        }
        
        if (await Transaction.count() === 0) {
            console.log('Seeding Transactions...');
            const checking = await Account.findOne({ where: { name: 'Checking Account' } });
            const salary = await Category.findOne({ where: { name: 'Salary' } });
            const food = await Category.findOne({ where: { name: 'Alimentation' } });

            if (checking && salary && food) {
                await Transaction.bulkCreate([
                    { 
                        accountId: checking.id, 
                        categoryId: salary.id, 
                        value: 2000.00, 
                        date: new Date().toISOString().split('T')[0], 
                        description: 'Monthly salary', 
                        transactionType: 'INCOME' 
                    },
                    { 
                        accountId: checking.id, 
                        categoryId: food.id, 
                        value: 50.75, 
                        date: new Date().toISOString().split('T')[0], 
                        description: 'Supermarket purchase', 
                        transactionType: 'EXPENSE' 
                    }
                ]);
                console.log('Transactions seeded successfully.');
            }
        }


    } catch (error) {
        console.error('Error during database seeding:', error);
    }
};

module.exports = seedDatabase;