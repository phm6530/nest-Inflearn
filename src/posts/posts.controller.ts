import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

type PostModel = {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
};

type postBody = { author: string; title: string; content: string };

let posts: PostModel[] = [
  {
    id: 1,
    author: '작성자-1',
    title: '타이틀',
    content: '',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: '작성자-2',
    title: '타이틀',
    content: '',
    likeCount: 10,
    commentCount: 110,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Get Posts
  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  // Get Post
  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    const post = posts.find((e) => +id === e.id);
    if (!post) throw new NotFoundException();
    return post;
  }

  // Post
  @Post()
  postPosts(@Body() body: postBody) {
    const { author, title, content } = body;
    const post: PostModel = {
      id: posts.at(-1).id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [post, ...posts];
    return post;
  }

  @Patch(':id')
  PatchPost(
    @Param('id') id: string,
    @Body() body: Partial<postBody>,
  ): PostModel {
    const { author, title, content } = body;
    const post = posts.find((e) => +id === e.id);

    if (!post) throw new NotFoundException();

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    posts = posts.map((e) => (e.id === +id ? post : e));

    return post;
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const post = posts.find((e) => +id === e.id);
    if (!post) throw new NotFoundException();

    const result = posts.filter((e) => e.id !== +id);
    return result;
  }
}
