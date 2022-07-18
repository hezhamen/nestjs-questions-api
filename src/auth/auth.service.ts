import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    try {
      const role = await this.prisma.role.findUnique({
        where: {
          id: dto.roleId,
        },
      });

      if (!role) {
        throw new NotFoundException('Invalid role');
      }

      const hash = await argon.hash(dto.password);
      // save user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          roleId: dto.roleId,
        },
      });

      // return user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user not found, throw error
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    // compare password with hash
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if not match, throw error
    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    // return user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    // create payload
    const payload = {
      sub: userId,
      email,
    };

    // create token
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
