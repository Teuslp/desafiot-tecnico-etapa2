import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number, imageUrl?: string) {
    const { categoryIds, ...data } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...data,
        imageUrl,
        createdById: userId,
        categories: categoryIds ? {
          connect: categoryIds.map((id) => ({ id })),
        } : undefined,
      },
      include: { categories: true },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        categories: true,
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, imageUrl?: string) {
    await this.findOne(id);
    const { categoryIds, ...data } = updateProductDto;

    const updateData: any = { ...data };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    if (categoryIds) {
      updateData.categories = {
        set: categoryIds.map((catId) => ({ id: catId })),
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { categories: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Produto removido com sucesso' };
  }

  // --- Sistema de Favoritos ---

  async favorite(productId: number, userId: number) {
    const product = await this.findOne(productId);

    await this.prisma.favorites.create({
      data: {
        userId,
        productId,
      },
    });

    // Disparar evento assíncrono para notificar o dono
    this.eventEmitter.emit('product.favorited', {
      productTitle: product.title,
      ownerEmail: product.createdBy.email,
      ownerId: product.createdById,
      favoritedBy: userId,
    });

    return { message: 'Produto favoritado com sucesso' };
  }

  async unfavorite(productId: number, userId: number) {
    await this.findOne(productId);
    
    await this.prisma.favorites.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { message: 'Produto desfavoritado com sucesso' };
  }
}
