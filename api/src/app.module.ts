import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SectionsModule } from './sections/sections.module';
import { ChaptersModule } from './chapters/chapters.module';

@Module({
  imports: [PrismaModule, SectionsModule, ChaptersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
