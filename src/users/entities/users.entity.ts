import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';
import { PostModel } from 'src/posts/entities/posts.entity';
import { RoleEnum } from 'src/users/const/roles.const';
import { Column, Entity, OneToMany } from 'typeorm';
/**
 * id number
 * nickname : string
 * email: string
 * password : string
 * role [RolesEnum.User]
 */

@Entity()
export class UsersModel extends BaseModel {
    //닉네임
    @Column({ unique: true, length: 20 })
    nickname: string;

    //이메일
    @Column({ unique: true })
    email: string;

    //Password
    /**
     * Exclude는 제외시킴,
     *
     * request (클라이언트 -> 서버)
     * 직렬화 -> 클래스 인스턴스로 변환할 때(password 입력 필요),
     * 즉 요청 시에는 허용해야 하므로 toClassOnly: true 사용.
     *
     * response (서버 -> 클라이언트)
     * 객체를 JSON으로 직렬화할 때는 password를 제외해야 하므로
     * toPlainOnly: true로 설정하여 응답 시에 제외.
     */

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    //기본값 User
    @Column({ enum: Object.values(RoleEnum), default: RoleEnum.USER })
    Role: RoleEnum;

    @OneToMany(() => PostModel, (post) => post.author)
    posts: PostModel[];
}
