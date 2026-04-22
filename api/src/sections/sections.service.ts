import { Injectable, ConflictException } from '@nestjs/common';
import { writeFile, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import type { Express } from 'express';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

type CreateSectionFiles = {
  bgFile: Express.Multer.File;
  subtitleFile: Express.Multer.File;
};

type UpdateSectionFiles = {
  bgFile?: Express.Multer.File;
  subtitleFile?: Express.Multer.File;
};

const STATIC_DIR = join(__dirname, '..', '..', 'static');

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto, files: CreateSectionFiles) {
    const existingSectionWithName = await this.prisma.section.findFirst({
      where: { name: createSectionDto.name },
    });

    if (existingSectionWithName) {
      throw new ConflictException(
        `Sección con nombre "${createSectionDto.name}" ya existe.`,
      );
    }

    const bgExt = extname(files.bgFile.originalname);
    const subtitleExt = extname(files.subtitleFile.originalname);

    const bgFileName = `${randomUUID()}${bgExt}`;
    const subtitleFileName = `${randomUUID()}${subtitleExt}`;

    await writeFile(
      join(STATIC_DIR, 'backgrounds', bgFileName),
      files.bgFile.buffer,
    );
    await writeFile(
      join(STATIC_DIR, 'subtitles', subtitleFileName),
      files.subtitleFile.buffer,
    );

    await this.prisma.section.create({
      data: {
        name: createSectionDto.name,
        bg_color: createSectionDto.bg_color,
        bg_url: bgFileName,
        flag_url: subtitleFileName,
      },
    });

    return `Sección "${createSectionDto.name}" creada exitosamente.`;
  }

  findAll() {
    return this.prisma.section.findMany();
  }

  findOne(id: number) {
    return this.prisma.section.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateSectionDto: UpdateSectionDto,
    files: UpdateSectionFiles,
  ) {
    const existingSection = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new ConflictException(`Sección inexistente.`);
    }

    const data: Prisma.SectionUpdateInput = {
      ...updateSectionDto,
    };

    if (files.bgFile) {
      await unlink(join(STATIC_DIR, 'backgrounds', existingSection.bg_url));

      const bgExt = extname(files.bgFile.originalname);
      const bgFileName = `${randomUUID()}${bgExt}`;
      await writeFile(
        join(STATIC_DIR, 'backgrounds', bgFileName),
        files.bgFile.buffer,
      );
      data.bg_url = bgFileName;
    }

    if (files.subtitleFile) {
      await unlink(join(STATIC_DIR, 'subtitles', existingSection.flag_url));

      const subtitleExt = extname(files.subtitleFile.originalname);
      const subtitleFileName = `${randomUUID()}${subtitleExt}`;
      await writeFile(
        join(STATIC_DIR, 'subtitles', subtitleFileName),
        files.subtitleFile.buffer,
      );
      data.flag_url = subtitleFileName;
    }

    await this.prisma.section.update({
      where: { id },
      data,
    });

    return `Sección actualizada exitosamente.`;
  }

  async remove(id: number) {
    const existingSection = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new ConflictException(`Sección inexistente.`);
    }

    const chapterFiles = await this.prisma.chapter.findMany({
      where: { section_id: id },
      select: {
        cover_url: true,
        file_url: true,
      },
    });

    await Promise.all(
      chapterFiles.flatMap((chapter) => [
        unlink(join(STATIC_DIR, 'covers', chapter.cover_url)),
        unlink(join(STATIC_DIR, 'chapters', chapter.file_url)),
      ]),
    );

    await unlink(join(STATIC_DIR, 'backgrounds', existingSection.bg_url));
    await unlink(join(STATIC_DIR, 'subtitles', existingSection.flag_url));

    await this.prisma.section.delete({
      where: { id },
    });

    return `Sección #${id} eliminada exitosamente.`;
  }
}
