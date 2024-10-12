import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PostModel } from 'src/posts/entities/posts.entity';

/**
 * pick Omit 처럼 사용가능
 *
 * picktype("mopdel" , [key, key]) 하면 해당 타입의 값만 반환함
 * 클래스니까 extneds로 확장하여 DTO 사용가능,
 *
 */

//해당 로직에서 PickType은 그냥 .. 명시적으로 기재해뒀음.
//이로직은 합쳐도됨
export class CreatePostDto extends PickType(PostModel, [
    'title',
    'content',
    'image',
]) {
    @IsString({ message: 'string 값을 입력해야합니다.' })
    title: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    image?: string;

    // @IsString({
    //     each: true,
    // })
    // @IsOptional()
    // images: string[] = [];
}
