import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async getRoles() {
    return this.roleService.getAllRoles();
  }

  @Post()
  async createRole(@Body() body: RoleDto) {
    return this.roleService.createRole(body);
  }
}
