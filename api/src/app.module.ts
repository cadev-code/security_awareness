import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [PrismaModule, SectionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
