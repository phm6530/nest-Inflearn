import { Type } from 'class-transformer';
import { IsIn, isNumber, IsNumber, IsOptional } from 'class-validator';

class TakeDto {
    //20개씩 가져오기 === limit
    @IsNumber()
    @IsOptional()
    take: number = 10;

    //오름차순
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt: 'ASC' | 'DESC' = 'DESC';
}

//Cursor PageNation
export class PaginatePostDto extends TakeDto {
    // 이전 마지막 데이터의 ID
    // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져옴
    @IsNumber()
    @IsOptional()
    where_id_less_than?: number;

    @IsNumber()
    @IsOptional()
    where_id_more_than?: number;
}

//Page PageNation
export class PagePaginationDto extends TakeDto {
    @IsNumber()
    @IsIn([1]) //기본 page 1로 설정
    page: number;
}
