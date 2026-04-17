import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseFilePipe,
  ParseFilePipeBuilder,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

type ChapterUploadedFiles = {
  cover_file?: Express.Multer.File[];
  chapter_file?: Express.Multer.File[];
};

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  private readonly coverFilePipe: ParseFilePipe = new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: /^image\/(png|jpe?g|webp)$/i })
    .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
    .build({
      fileIsRequired: true,
      errorHttpStatusCode: 422,
    });

  private readonly chapterFilePipe: ParseFilePipe = new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^(image\/(png|jpe?g|webp|gif)|video\/mp4|audio\/mpeg)$/i,
    })
    .addMaxSizeValidator({ maxSize: 800 * 1024 * 1024 })
    .build({
      fileIsRequired: true,
      errorHttpStatusCode: 422,
    });

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover_file', maxCount: 1 },
      { name: 'chapter_file', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createChapterDto: CreateChapterDto,
    @UploadedFiles() files: ChapterUploadedFiles,
  ) {
    const coverFile = files.cover_file?.[0];
    const chapterFile = files.chapter_file?.[0];

    if (!coverFile || !chapterFile) {
      throw new BadRequestException(
        'Archivo de portada y archivo de capítulo son requeridos',
      );
    }

    await this.coverFilePipe.transform(coverFile);
    await this.chapterFilePipe.transform(chapterFile);

    return this.chaptersService.create(createChapterDto, {
      coverFile,
      chapterFile,
    });
  }

  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }
}
