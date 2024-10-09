import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { PostModel } from 'src/posts/entities/posts.entity';
import { RoleEnum } from 'src/users/const/roles.const';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
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
    @Length(1, 20, { message: '길이 1~20 허용' })
    nickname: string;

    //이메일
    @Column({ unique: true })
    @IsEmail({}, { message: '이메일 형식이 틀렸습니다.' })
    email: string;

    //Password
    @Column()
    @IsString()
    password: string;

    //기본값 User
    @Column({ enum: Object.values(RoleEnum), default: RoleEnum.USER })
    Role: RoleEnum;

    @OneToMany(() => PostModel, (post) => post.author)
    posts: PostModel[];
}
