import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository } from 'typeorm';
import importConfig from '../config/import';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface ImportData {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    await getRepository(Transaction).delete({});

    const transactions = await this.loadCSV(importConfig.filePath);

    return transactions;
  }

  private async loadCSV(filePath: string): Promise<Transaction[]> {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const service = new CreateTransactionService();

    const datas: ImportData[] = [];
    const transactions: Transaction[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      const data = {
        title,
        type,
        value: +value,
        category,
      };

      datas.push(data);
    });

    await new Promise(resolve => {
      parseCSV.on('end', () => {
        datas.reduce((prev: Promise<void>, item: ImportData) => {
          return prev.then(async () => {
            const { title, type, value, category } = item;

            const transaction = await service.execute({
              title,
              type,
              value,
              category,
            });

            transactions.push(transaction);

            if (transactions.length === datas.length) {
              resolve();
            }
          });
        }, Promise.resolve());
      });
    });

    return transactions;
  }
}

export default ImportTransactionsService;
