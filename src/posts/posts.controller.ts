import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { postBody, PostModel } from 'src/posts/posts.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Get Posts
  @Get()
  getPosts(): PostModel[] {
    return this.postsService.getAllPost();
  }

  // Get Post
  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    return this.postsService.getPost(+id);
  }

  // Post
  @Post()
  postPosts(@Body() body: postBody) {
    return this.postsService.createPost(body);
  }

  @Patch(':id')
  PatchPost(
    @Param('id') id: string,
    @Body() body: Partial<postBody>,
  ): PostModel {
    return this.postsService.updatePost(+id, body);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
