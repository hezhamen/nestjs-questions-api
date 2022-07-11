import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('answer')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Post('/:questionId')
  create(
    @Body() dto: CreateAnswerDto,
    @Param('questionId', ParseIntPipe) questionId: number,
    @GetUser('id') userId: number,
  ) {
    return this.answerService.create(dto, questionId, userId);
  }

  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.answerService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @GetUser('id') userId: number,
  ) {
    return this.answerService.update(+id, updateAnswerDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.answerService.remove(+id, userId);
  }
}
