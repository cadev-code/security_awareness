import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new ConflictException(`Credenciales invalidas.`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ConflictException(`Contraseña incorrecta.`);
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
