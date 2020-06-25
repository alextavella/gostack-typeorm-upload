import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const repositoryTransaction = getCustomRepository(TransactionRepository);
    const repositoryCategory = getRepository(Category);

    if (type === 'outcome') {
      const balance = await repositoryTransaction.getBalance();
      if (balance.total < value) {
        throw new AppError('Transaction invalid', 400);
      }
    }

    const findCategory = await repositoryCategory.findOne({
      where: {
        title: category,
      },
    });

    const transactionCategory =
      findCategory ||
      repositoryCategory.create({
        title: category,
      });

    if (!findCategory) {
      await repositoryCategory.save(transactionCategory);
    }

    const transaction = repositoryTransaction.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await repositoryTransaction.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
