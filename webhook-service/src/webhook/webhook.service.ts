import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  handleTransaction(transaction: any) {
    const { amount, category, bank } = transaction;
    console.log('Received transaction:', {
      amount,
      Category: category.name,
      Bank: bank.name,
      'Bank balance': bank.balance,
    });
  }
}
