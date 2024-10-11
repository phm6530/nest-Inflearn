import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
    @IsNumber()
    @IsOptional()
    take: number = 10;

    //오름차순
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt: 'ASC' | 'DESC' = 'DESC';

    @IsNumber()
    @IsOptional()
    where__id__less_than?: number;

    @IsNumber()
    @IsOptional()
    where__id__more_than?: number;

    @IsNumber()
    @IsOptional()
    where__likeCount__more_than?: number;
}
