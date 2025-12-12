import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { description, categoryIds, title, stock, price } = createProductDto;
    const product = this.productRepository.create({
      description,
      title,
      stock,
      price,
    });
    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      product.categories = categories;
    }
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['categories'] });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product)
      throw new NotFoundException(`محصولی با شناسه ${id} یافت نشد.`);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: ['categories'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
