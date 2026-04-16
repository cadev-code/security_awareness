import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { SectionsModule } from './sections/sections.module';
import { ChaptersModule } from './chapters/chapters.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    PrismaModule,
    SectionsModule,
    ChaptersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
