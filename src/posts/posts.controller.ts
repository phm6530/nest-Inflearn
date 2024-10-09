import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { postBody } from 'src/posts/posts.model';
import { PostModel } from 'src/posts/entities/posts.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';

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
    getPost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
        return this.postsService.getPostId(id);
    }

    // Post
    @Post()
    @UseGuards(AccessTokenGuard)
    postPosts(
        @User('nickname') user: UsersModel,
        @Body('title') title: string,
        @Body('content') content: string,
    ) {
        return this.postsService.createPost({
            authorId: user.id,
            title,
            content,
        });
    }

    @Put(':id')
    PatchPost(
        @Param('id') id: string,
        @Body() body: Omit<postBody, 'authorId'>,
    ): Promise<PostModel> {
        return this.postsService.updatePost(+id, body);
    }

    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number): Promise<number> {
        return this.postsService.deletePost(id);
    }
}
