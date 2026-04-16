import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDto } from './create-section.dto';
import { IsHexColor, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsHexColor()
  bg_color!: string;
}
