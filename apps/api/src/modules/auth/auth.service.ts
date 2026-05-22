import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(email: string, password: string) {
    const user = await this.validateCredentials(email, password);
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken, user };
  }

  private async validateCredentials(email: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
