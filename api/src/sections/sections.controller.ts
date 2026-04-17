import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseFilePipe,
  ParseFilePipeBuilder,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { AuthGuard } from '../auth/auth.guard';

type SectionUploadedFiles = {
  bg_file?: Express.Multer.File[];
  subtitle_file?: Express.Multer.File[];
};

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  private readonly imageFilePipe: ParseFilePipe = new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: /^image\/(png|jpe?g|webp)$/i })
    .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
    .build({
      fileIsRequired: true,
      errorHttpStatusCode: 422,
    });

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'bg_file', maxCount: 1 },
      { name: 'subtitle_file', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createSectionDto: CreateSectionDto,
    @UploadedFiles() files: SectionUploadedFiles,
  ) {
    const bgFile = files.bg_file?.[0];
    const subtitleFile = files.subtitle_file?.[0];

    if (!bgFile || !subtitleFile) {
      throw new BadRequestException(
        'Archivo de fondo y archivo de subtítulo son requeridos',
      );
    }

    await this.imageFilePipe.transform(bgFile);
    await this.imageFilePipe.transform(subtitleFile);

    return this.sectionsService.create(createSectionDto, {
      bgFile,
      subtitleFile,
    });
  }

  @Get()
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'bg_file', maxCount: 1 },
      { name: 'subtitle_file', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
    @UploadedFiles() files?: SectionUploadedFiles,
  ) {
    const bgFile = files?.bg_file?.[0];
    const subtitleFile = files?.subtitle_file?.[0];

    if (bgFile) {
      await this.imageFilePipe.transform(bgFile);
    }

    if (subtitleFile) {
      await this.imageFilePipe.transform(subtitleFile);
    }

    return this.sectionsService.update(+id, updateSectionDto, {
      bgFile,
      subtitleFile,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(+id);
  }
}
