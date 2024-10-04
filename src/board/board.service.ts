import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from 'src/board/board.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BoardService {
  private boards: Board[] = [];

  getAllBoard(): Board[] {
    return this.boards;
  }

  createBoard(title: string, description: string) {
    const board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    return board;
  }
}
