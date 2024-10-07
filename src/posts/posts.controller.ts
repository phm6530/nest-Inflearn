import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { postBody } from 'src/posts/posts.model';
import { PostModel } from 'src/posts/entities/posts.entity';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // Get Posts
    @Get()
    getPosts(): Promise<PostModel[]> {
        return this.postsService.getAllPost();
    }

    // Get Post
    @Get(':id')
    getPost(@Param('id') id: string): Promise<PostModel> {
        return this.postsService.getPostId(+id);
    }

    // Post
    @Post()
    postPosts(@Body() body: postBody) {
        return this.postsService.createPost(body);
    }

    @Put(':id')
    PatchPost(
        @Param('id') id: string,
        @Body() body: Omit<postBody, 'authorId'>,
    ): Promise<PostModel> {
        return this.postsService.updatePost(+id, body);
    }

    @Delete(':id')
    deletePost(@Param('id') id: string): Promise<number> {
        return this.postsService.deletePost(+id);
    }
}
