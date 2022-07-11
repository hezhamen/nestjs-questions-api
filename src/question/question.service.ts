import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuestionDto, roleId: number) {
    if (roleId !== 1) {
      throw new ForbiddenException('Only QA can create questions.');
    }

    const question = await this.prisma.question.create({
      data: {
        ...dto,
        userId,
      },
    });

    return question;
  }

  findAll() {
    const questions = this.prisma.question.findMany({
      include: {
        answers: true,
      },
    });

    return questions;
  }

  findOne(id: number) {
    // questions + the answers to the question
    const question = this.prisma.question.findUnique({
      where: {
        id,
      },
      include: {
        answers: true,
      },
    });

    if (!question) {
      throw new ForbiddenException('Question not found.');
    }

    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    userId: number,
  ) {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    if (question.userId !== userId) {
      throw new ForbiddenException('You can only edit your own questions.');
    }

    return this.prisma.question.update({
      where: {
        id,
      },
      data: {
        ...updateQuestionDto,
      },
    });
  }

  async remove(id: number, userId: number) {
    // Check if question is owned by user
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.userId !== userId) {
      throw new ForbiddenException('You can only delete your own questions.');
    }

    return this.prisma.question.delete({
      where: {
        id,
      },
    });
  }

  async removeAll() {
    return this.prisma.question.deleteMany({});
  }
}
