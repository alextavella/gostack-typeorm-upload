import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionRepository);

  const transactions: Transaction[] = await repository.find({
    relations: ['category'],
  });

  const balance = await repository.getBalance();

  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transaction = await new CreateTransactionService().execute({
    title,
    value,
    type,
    category,
  });

  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await new DeleteTransactionService().execute({ id });

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  const transactions = await new ImportTransactionsService().execute();

  return response.status(200).json({ transactions });
});

export default transactionsRouter;
