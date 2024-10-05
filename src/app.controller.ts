import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

type Post = {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Post {
    return {
      author: '타이틀',
      title: 'ttttt',
      content: 'con',
      likeCount: 1,
      commentCount: 100,
    };
  }
}
