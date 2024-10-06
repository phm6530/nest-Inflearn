import { Injectable, NotFoundException } from '@nestjs/common';
import { postBody, PostModel } from 'src/posts/posts.model';

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

@Injectable()
export class PostsService {
  getAllPost() {
    return posts;
  }

  getPost(id: number) {
    const post = posts.find((e) => +id === e.id);
    if (!post) throw new NotFoundException();
    return post;
  }

  createPost(body: postBody) {
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

  updatePost(id: number, body: Partial<postBody>) {
    const { author, title, content } = body;
    const post = posts.find((e) => +id === e.id);

    if (!post) throw new NotFoundException();

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    posts = posts.map((e) => (e.id === +id ? post : e));

    return post;
  }

  deletePost(id: number) {
    const post = posts.find((e) => +id === e.id);
    if (!post) throw new NotFoundException();

    const result = posts.filter((e) => e.id !== +id);
    return result;
  }
}
