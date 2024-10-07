import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from 'src/posts/entities/posts.entity';
import { postBody } from 'src/posts/posts.model';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    //Postmodel 주입
    constructor(
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
    ) {}

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

    async createPost(body: postBody) {
        const { authorId, title, content } = body;

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
}
