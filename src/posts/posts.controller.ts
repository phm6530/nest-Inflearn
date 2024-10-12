import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { postBody } from 'src/posts/posts.model';
import { PostModel } from 'src/posts/entities/posts.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import {
    PagePaginationDto,
    PaginatePostDto,
} from 'src/posts/dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // Get Posts
    @Get()
    getPosts(@Query() query: PaginatePostDto | PagePaginationDto) {
        return this.postsService.paginatePosts(query);
    }

    @Post('random')
    @UseGuards(AccessTokenGuard)
    randomPost(@User() user: UsersModel) {
        return this.postsService.generateRandomPost(user.id);
    }

    // Get Post
    @Get(':id')
    getPost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
        return this.postsService.getPostId(id);
    }

    // Post
    @Post()
    @UseGuards(AccessTokenGuard)
    async postPosts(
        @User('nickname') user: UsersModel,
        @Body() body: CreatePostDto,
    ) {
        await this.postsService.createPostImage({
            ...body,
        });

        return this.postsService.createPost({
            authorId: user.id,
            ...body,
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
