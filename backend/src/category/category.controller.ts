import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './category.service';
import { Category } from './entity/category.entuty';
import { updateCategoryDto } from './dto/update-category.dto ';
import { CreateCategoryDto } from './dto/create-category.dto ';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all categories',
    type: [Category],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve categories',
  })
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get category by ID',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve category',
  })
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.getCategoryById(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new category',
    type: Category,
  })
  @ApiConflictResponse({ description: 'Category name already exists' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create category' })
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(dto);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update category by ID',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({ description: 'Failed to update category' })
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: updateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({
    description: 'Cannot delete category with associated transactions',
  })
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }
}
