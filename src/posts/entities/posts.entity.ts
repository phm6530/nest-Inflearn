import { Transform } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { POST_PUBLIC_IMAGE_PATH } from 'src/common/const/path.const';

@Entity()
export class PostModel extends BaseModel {
    //관계설정
    @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
    author: UsersModel;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    @Transform(
        ({ value }) =>
            `/${POST_PUBLIC_IMAGE_PATH.replace(/\\/g, '/')}/${value}`,
        { toPlainOnly: true },
    )
    image?: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;

    // @OneToMany(() => ImageModel, (img) => img.post)
    // images: ImageModel[];
}
