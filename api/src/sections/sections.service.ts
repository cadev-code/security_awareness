import { Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../prisma/prisma.service';

type CreateSectionFiles = {
  bgFile: Express.Multer.File;
  subtitleFile: Express.Multer.File;
};

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSectionDto: CreateSectionDto, files: CreateSectionFiles) {
    console.log(
      createSectionDto,
      files.bgFile.originalname,
      files.subtitleFile.originalname,
    );
    return 'This action adds a new section';
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
