import { IsIn, IsNumber } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

//Cursor PageNation
export class PaginatePostDto extends BasePaginationDto {
    // 이전 마지막 데이터의 ID
    // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져옴
}

//Page PageNation
export class PagePaginationDto extends BasePaginationDto {
    @IsNumber()
    @IsIn([1]) //기본 page 1로 설정
    page: number;
}
