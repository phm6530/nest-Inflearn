import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { HOST } from 'src/common/const/env.const';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import {
    PagePaginationDto,
    PaginatePostDto,
} from 'src/posts/dto/paginate-post.dto';
import { PostModel } from 'src/posts/entities/posts.entity';
import { postBody } from 'src/posts/posts.model';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class PostsService {
    //Postmodel 주입
    constructor(
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
    ) {}

    async cursorPageNation(dto: PaginatePostDto) {
        const {
            where_id_less_than,
            where_id_more_than,
            order__createdAt,
            take,
        } = dto;

        const where: FindOptionsWhere<PostModel> = {};
        if (where_id_more_than) {
            where.id = MoreThan(where_id_more_than);
        }
        if (where_id_less_than) {
            where.id = LessThan(where_id_less_than);
        }

        //가져오기
        const results = await this.postRepository.find({
            where,
            order: {
                createAt: order__createdAt,
            },
            take,
        });

        //다음값 NextPage 논리추가
        const lastItem =
            results.length > 0 && results.length === take
                ? results.at(-1)
                : null;
        const nextUrl = lastItem && new URL(`${HOST}/posts`);

        if (nextUrl) {
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (
                        key !== 'where_id_more_than' &&
                        key !== 'where_id_less_than'
                    )
                        nextUrl.searchParams.append(key, dto[key]);
                }
            }
            let key = null;

            if (order__createdAt === 'ASC') {
                key = 'where_id_more_than';
            }
            if (order__createdAt === 'DESC') {
                key = 'where_id_less_than';
            }

            nextUrl.searchParams.append(key, lastItem.id.toString());
        }

        return {
            //페이지 Datas
            datas: results,
            cursor: {
                after: lastItem?.id || null,
            },
            count: results.length,
            next: nextUrl?.toString() ?? null,
        };
    }

    async pagePageNation(dto: PagePaginationDto) {
        const { page, take, order__createdAt } = dto;

        const [posts, count] = await this.postRepository.findAndCount({
            skip: (page - 1) * take,
            take,
            order: {
                createAt: order__createdAt,
            },
        });

        return {
            data: posts,
            total: count,
        };
    }

    async paginatePosts(dto: PaginatePostDto | PagePaginationDto) {
        if ('page' in dto) {
            //page
            return this.pagePageNation(dto);
        } else {
            //Cursor
            return await this.cursorPageNation(dto);
        }
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
        const { authorId, title, content } = body;

        if (!authorId || !title || !content)
            throw new BadRequestException('누락된 값이 있습니다.');

        const post = this.postRepository.create({
            author: {
                id: authorId,
            },
            title,
            content,
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

    async generateRandomPost(userId: number) {
        console.log(userId);
        for (let i = 0; i < 100; i++) {
            await this.createPost({
                authorId: userId,
                title: `임의로 생성한 ${i}번째 제목`,
                content: `임의로 생성한 ${i}번째 콘텐츠`,
            });
        }
        return true;
    }
}
