import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('transactions')
  async handleTransaction(@Body() body: any) {
    this.webhookService.handleTransaction(body);
  }
}
