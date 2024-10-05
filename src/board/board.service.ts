import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from 'src/board/board.model';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BoardService {
  private boards: Board[] = [];

  getAllBoard(): Board[] {
    return this.boards;
  }

  createBoard(CreateBoardDto: CreateBoardDto) {
    const { title, description } = CreateBoardDto;
    const board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    return board;
  }

  getBoardById(id: string) {
    const test = this.boards.find((e) => e.id === id);
    return {
      num: id,
      test: test || {},
    };
  }

  deleteBoard(id: string): void {
    console.log(id);
  }
}
