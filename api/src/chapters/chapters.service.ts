import { ConflictException, Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PrismaService } from '../prisma/prisma.service';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { unlink, writeFile } from 'fs/promises';

type CreateChapterFiles = {
  coverFile: Express.Multer.File;
  chapterFile: Express.Multer.File;
};

const STATIC_DIR = join(__dirname, '..', '..', 'static');

@Injectable()
export class ChaptersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChapterDto: CreateChapterDto, files: CreateChapterFiles) {
    const existingSection = await this.prisma.section.findUnique({
      where: { id: createChapterDto.sectionId },
    });

    if (!existingSection) {
      throw new ConflictException('La sección especificada no existe');
    }

    const existingChapterWithName = await this.prisma.chapter.findFirst({
      where: {
        name: createChapterDto.name,
        section_id: createChapterDto.sectionId,
      },
    });

    if (existingChapterWithName) {
      throw new ConflictException(
        `Ya existe un capítulo con el nombre "${createChapterDto.name}" en esta sección`,
      );
    }

    const coverExt = extname(files.coverFile.originalname);
    const chapterExt = extname(files.chapterFile.originalname);

    const coverFileName = `${randomUUID()}${coverExt}`;
    const chapterFileName = `${randomUUID()}${chapterExt}`;

    await writeFile(
      join(STATIC_DIR, 'covers', coverFileName),
      files.coverFile.buffer,
    );

    await writeFile(
      join(STATIC_DIR, 'chapters', chapterFileName),
      files.chapterFile.buffer,
    );

    await this.prisma.chapter.create({
      data: {
        name: createChapterDto.name,
        showName: false,
        cover_url: coverFileName,
        file_url: chapterFileName,
        file_type: createChapterDto.file_type,
        availability: createChapterDto.availability,
        section_id: createChapterDto.sectionId,
        questions_url: createChapterDto.questions_url,
      },
    });

    return `Capitulo ${createChapterDto.name} creado exitosamente`;
  }

  findAll() {
    return this.prisma.chapter.findMany();
  }

  findOne(id: number) {
    return this.prisma.chapter.findMany({
      where: {
        section_id: id,
      },
    });
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  async remove(id: number) {
    const existingChapter = await this.prisma.chapter.findUnique({
      where: { id },
    });

    if (!existingChapter) {
      throw new ConflictException('El capítulo especificado no existe');
    }

    await unlink(join(STATIC_DIR, 'covers', existingChapter.cover_url));
    await unlink(join(STATIC_DIR, 'chapters', existingChapter.file_url));

    await this.prisma.chapter.delete({
      where: { id },
    });

    return `Capítulo ${existingChapter.name} eliminado exitosamente`;
  }
}
