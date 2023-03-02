import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entuty';
import { updateCategoryDto } from './dto/update-category.dto ';
import { CreateCategoryDto } from './dto/create-category.dto ';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    try {
      return this.categoriesRepository.save(dto);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Category name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return this.categoriesRepository.find();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCategory(id: number, dto: updateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      const updatedCategory = Object.assign(category, dto);
      return this.categoriesRepository.save(updatedCategory);
    } catch (error) {
      throw new HttpException(
        'Failed to update category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.categoriesRepository.remove(category);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete category with associated transactions',
        );
      }
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
