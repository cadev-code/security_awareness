import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Se ejecuta cuando el módulo de Nestjs se inicia
  async onModuleInit(): Promise<void> {
    await (this.$connect as () => Promise<void>)();
  }

  // Se ejecuta cuando la aplicación se apaga (limpieza de conexiones)
  async onModuleDestroy(): Promise<void> {
    await (this.$disconnect as () => Promise<void>)();
  }
}
