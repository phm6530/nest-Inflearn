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
        return this.postRepository.find();
    }

    async getPost(id: number) {
        const post = await this.postRepository.findOne({
            where: { id },
        });

        if (!post) throw new NotFoundException();
        return post;
    }

    async createPost(body: postBody) {
        const { author, title, content } = body;

        const post = this.postRepository.create({
            author,
            title,
            content,
            likeCount: 0,
            commentCount: 0,
        });

        return this.postRepository.save(post);
    }

    async updatePost(id: number, body: Partial<postBody>) {
        const { author, title, content } = body;

        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });

        if (!post) throw new NotFoundException();

        if (author) post.author = author;
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
