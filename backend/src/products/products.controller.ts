import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto (com imagem)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/products/${file.filename}` : undefined;
    return this.productsService.create(createProductDto, req.user.id, imageUrl);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Listar produtos favoritos do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de favoritos retornada.' })
  getFavorites(@Request() req) {
    return this.productsService.getFavorites(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'search', required: false, description: 'Pesquisar por título' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por nome da categoria' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada.' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll(page, limit, search, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um produto específico' })
  @ApiResponse({ status: 200, description: 'Dados do produto.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um produto existente' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Produto atualizado.' })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/products/${file.filename}` : undefined;
    return this.productsService.update(id, updateProductDto, imageUrl);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiResponse({ status: 200, description: 'Produto removido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiResponse({ status: 201, description: 'Adicionado aos favoritos.' })
  favorite(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.productsService.favorite(id, req.user.id);
  }

  @Delete(':id/favorite')
  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  @ApiResponse({ status: 200, description: 'Removido dos favoritos.' })
  unfavorite(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.productsService.unfavorite(id, req.user.id);
  }
}
