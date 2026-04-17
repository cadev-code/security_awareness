import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
