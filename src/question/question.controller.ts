import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { GetRole } from 'src/auth/decorator/get-role.decorator';

@UseGuards(JwtGuard)
@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @GetRole('roleId') roleId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.create(userId, createQuestionDto, roleId);
  }

  // ✅
  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto, userId);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.questionService.remove(+id, userId);
  }

  @Delete()
  removeAll() {
    return this.questionService.removeAll();
  }
}
