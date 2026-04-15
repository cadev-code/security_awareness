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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

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
        'bg_file and subtitle_file are required files',
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(+id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(+id);
  }
}
