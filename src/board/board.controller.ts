import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { Board } from 'src/board/board.model';
import { BoardService } from 'src/board/board.service';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  //GetList
  @Get('/')
  getAllBoard(): Board[] {
    return this.boardService.getAllBoard();
  }

  //POST
  @Post()
  createBoard(@Body() CreateBoardDto: CreateBoardDto): Board {
    return this.boardService.createBoard(CreateBoardDto);
  }

  //Detail
  @Get('/:id')
  getBoardById(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException(`ID "${id}" is not a valid number`);
    }
    return this.boardService.getBoardById(id);
  }

  //삭제
  @Delete('/:id')
  deleteBoard(@Param('id') id: string) {
    this.boardService.deleteBoard(id);
  }
}
