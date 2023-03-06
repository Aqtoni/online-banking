import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto ';
import { CreateCategoryDto } from './dto/create-category.dto ';
import { AlreadyExistsException } from 'src/filters/already-exists';
import { CannotDeleteException } from 'src/filters/cannot-delete';
import { NotFindException } from 'src/filters/not-found';

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
        throw new AlreadyExistsException(
          'Category with this name already exists',
        );
      }
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFindException('Category not found');
    }
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFindException('Category not found');
    }
    const updatedCategory = Object.assign(category, dto);
    return this.categoriesRepository.save(updatedCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new NotFindException('Category not found');
      }

      await this.categoriesRepository.remove(category);
    } catch (error) {
      if (error.code === '23503') {
        throw new CannotDeleteException();
      }
      throw error;
    }
  }
}
