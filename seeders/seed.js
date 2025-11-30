const db = require('../infra/database');

const seedDatabase = async () => {
    try {
        const { Category, Account, Transaction } = db.models;

        const categoryCount = await Category.count();
        if (categoryCount === 0) {
            console.log('Seeding Categories...');
            await Category.bulkCreate([
                { name: 'Alimentation', type: 'variable' },
                { name: 'Rent', type: 'fixed' },
                { name: 'Salary', type: 'fixed' },
                { name: 'Transportation', type: 'variable' },
                { name: 'Leisure', type: 'variable' },
            ]);
            console.log('Categories seeded successfully.');
        } else {
            console.log('Categories already exist, skipping seed.');
        }

        const accountCount = await Account.count();
        if (accountCount === 0) {
            console.log('Seeding Accounts...');
            await Account.bulkCreate([
                { name: 'Checking Account', initialBalance: 1500.50 },
                { name: 'Savings Account', initialBalance: 5000.00 },
            ]);
            console.log('Accounts seeded successfully.');
        } else {
            console.log('Accounts already exist, skipping seed.');
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