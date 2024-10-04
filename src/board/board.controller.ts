import { Body, Controller, Get, Post } from '@nestjs/common';
import { Board } from 'src/board/board.model';
import { BoardService } from 'src/board/board.service';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('/')
  getAllBoard(): Board[] {
    return this.boardService.getAllBoard();
  }

  @Post()
  createBoard(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Board {
    return this.boardService.createBoard(title, description);
  }
}
