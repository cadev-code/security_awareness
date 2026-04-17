import { Prisma } from '@prisma/client';
import {
  Contains,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  name!: Prisma.ChapterCreateInput['name'];

  @IsEnum(FileType, {
    message: `file_type debe ser uno de: ${Object.values(FileType).join(', ')}`,
  })
  @IsNotEmpty()
  file_type!: FileType;

  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  availability!: Prisma.ChapterCreateInput['availability'];

  @Transform(({ value }: { value: string }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  sectionId!: number;

  @IsOptional()
  @IsString()
  @Contains('http', {
    message: 'El campo examen_url debe contener una URL válida',
  })
  questions_url?: Prisma.ChapterCreateInput['questions_url'];
}
