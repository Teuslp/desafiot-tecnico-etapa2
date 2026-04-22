import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Eletrônicos' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
