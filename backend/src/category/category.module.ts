import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entuty';
import { Module } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CategoriesController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoryModule {}
