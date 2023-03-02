import { Body, Controller, Post } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post('transactions')
  async handleTransaction(
    @Body()
    body: {
      amount: number;
      category: { name: string };
      bank: { name: string; balance: number };
    },
  ) {
    const { amount, category, bank } = body;
    console.log('Received transaction:', {
      amount,
      Category: category.name,
      Bank: bank.name,
      'Bank balance': bank.balance,
    });
  }
}
