import { IsString } from 'class-validator';

/**
 * pick Omit 처럼 사용가능
 *
 * picktype("mopdel" , [key, key]) 하면 해당 타입의 값만 반환함
 * 클래스니까 extneds로 확장하여 DTO 사용가능,
 *
 */

export class CreatePostDto {
    @IsString({ message: 'string 값을 입력해야합니다.' })
    title: string;

    @IsString()
    content: string;
}
