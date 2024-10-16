import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import { CommonService } from 'src/common/common.service';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import {
    PagePaginationDto,
    PaginatePostDto,
} from 'src/posts/dto/paginate-post.dto';
import { PostModel } from 'src/posts/entities/posts.entity';
import { postBody } from 'src/posts/posts.model';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    //Postmodel 주입
    constructor(
        @InjectRepository(PostModel) //자동으로 리포지토리 추론함
        private readonly postRepository: Repository<PostModel>,
        private readonly commentService: CommonService,
    ) {}

    async pagePageNation(dto: PagePaginationDto) {
        const { page, take, order__createdAt } = dto;

        const [posts, count] = await this.postRepository.findAndCount({
            skip: (page - 1) * take,
            take,
            order: {
                createdAt: order__createdAt,
            },
        });

        return {
            data: posts,
            total: count,
        };
    }

    async paginatePosts(dto: PaginatePostDto | PagePaginationDto) {
        return await this.commentService.paginate(
            dto,
            this.postRepository,
            {
                relations: ['author'],
            },
            'posts',
        );
    }

    async getAllPost() {
        return this.postRepository.find({
            relations: ['author'],
        });
    }

    async getPostId(id: number) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author'],
        });

        if (!post) throw new NotFoundException('못찾음');
        return post;
    }

    async createPost(body: { authorId: number } & CreatePostDto) {
        const { authorId, title, content, image } = body;

        if (!authorId || !title || !content)
            throw new BadRequestException('누락된 값이 있습니다.');

        const post = this.postRepository.create({
            author: {
                id: authorId,
            },
            title,
            content,
            image,
            likeCount: 0,
            commentCount: 0,
        });

        return this.postRepository.save(post);
    }

    async updatePost(id: number, body: Omit<postBody, 'authorId'>) {
        const { title, content } = body;

        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });

        if (!post) throw new NotFoundException();
        if (title) post.title = title;
        if (content) post.content = content;

        return this.postRepository.save(post);
    }

    async deletePost(id: number) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });
        if (!post) throw new NotFoundException();

        await this.postRepository.delete(id);
        return id;
    }

    //public 생성
    async createPostImage(dto: CreatePostDto) {
        const tempFIlePath = join(`${process.cwd()}/temp/posts`, dto.image);
        console.log(tempFIlePath);

        //promises는 void이기때문에 try catch에러 잡아야함
        try {
            await promises.access(tempFIlePath);
        } catch (err) {
            throw new BadRequestException('존재하지 않는 파일');
        }

        const filename = basename(tempFIlePath);
        const newPath = join(`${process.cwd()}/public/posts`, filename);

        await promises.rename(tempFIlePath, newPath);
    }

    async generateRandomPost(userId: number) {
        for (let i = 0; i < 100; i++) {
            await this.createPost({
                authorId: userId,
                title: `임의로 생성한 ${i}번째 제목`,
                content: `임의로 생성한 ${i}번째 콘텐츠`,
                // images: [],
            });
        }
        return true;
    }
}
