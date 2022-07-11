import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(body: any) {
    const role = await this.prisma.role.create({
      data: {
        name: body.name,
      },
    });

    return role;
  }

  async getAllRoles() {
    const roles = await this.prisma.role.findMany();

    return roles;
  }
}
