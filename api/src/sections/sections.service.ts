import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import type { Express } from 'express';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../prisma/prisma.service';

type CreateSectionFiles = {
  bgFile: Express.Multer.File;
  subtitleFile: Express.Multer.File;
};

const STATIC_DIR = join(__dirname, '..', '..', 'static');

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto, files: CreateSectionFiles) {
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

    return this.prisma.section.create({
      data: {
        name: createSectionDto.name,
        bg_color: createSectionDto.bg_color,
        bg_url: `/static/backgrounds/${bgFileName}`,
        flag_url: `/static/subtitles/${subtitleFileName}`,
      },
    });
  }

  findAll() {
    return this.prisma.section.findMany();
  }

  findOne(id: number) {
    return this.prisma.section.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
