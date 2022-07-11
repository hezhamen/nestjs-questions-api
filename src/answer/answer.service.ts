import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAnswerDto, questionId: number, userId: number) {
    return this.prisma.answer.create({
      data: {
        ...dto,
        questionId,
        userId,
      },
    });
  }

  findAll() {
    return this.prisma.answer.findMany({});
  }

  async findOne(id: number, userId: number) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return answer;
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto, userId: number) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.userId !== userId) {
      throw new ForbiddenException('You can only update your own answers');
    }

    return this.prisma.answer.update({
      where: { id },
      data: {
        ...updateAnswerDto,
      },
    });
  }

  async remove(id: number, userId: number) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.userId !== userId) {
      throw new ForbiddenException('You can only delete your own answers');
    }

    return this.prisma.answer.delete({
      where: {
        id,
      },
    });
  }
}
