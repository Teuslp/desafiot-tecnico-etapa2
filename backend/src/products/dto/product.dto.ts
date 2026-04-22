import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook X' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Um excelente notebook' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 4500.50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: [1, 2], description: 'IDs das categorias' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map(Number);
    if (Array.isArray(value)) return value.map(Number);
    return value;
  })
  categoryIds?: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
