import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { Module } from '@nestjs/common';
import { Banks } from './entity/banks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banks])],
  providers: [BanksService],
  controllers: [BanksController],
})
export class BanksModule {}
