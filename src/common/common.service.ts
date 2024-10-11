import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FILTER_MAPPER } from 'src/auth/const/filter-mapper.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { ENV_HOST } from 'src/env-keys.const';
import {
    PagePaginationDto,
    PaginatePostDto,
} from 'src/posts/dto/paginate-post.dto';
import {
    FindManyOptions,
    FindOptionsOrder,
    FindOptionsWhere,
    Repository,
} from 'typeorm';

@Injectable()
export class CommonService {
    constructor(private readonly configService: ConfigService) {}

    paginate<T extends BaseModel>(
        dto: PaginatePostDto | PagePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        if ('page' in dto) {
            //page
            return this.pagePaginate<T>(dto, repository, overrideFindOptions);
        } else {
            //Cursor
            return this.cursorPaginate<T>(
                dto,
                repository,
                overrideFindOptions,
                path,
            );
        }
    }

    private async cursorPaginate<T extends BaseModel>(
        dto: PaginatePostDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        const findOptions = this.composeFindOptions<T>(dto);

        const results = await repository.find({
            ...findOptions,
            ...overrideFindOptions,
        });

        const host = this.configService.get<string>(ENV_HOST);

        const lastItem =
            results.length > 0 && results.length === dto.take
                ? results.at(-1)
                : null;
        const nextUrl = lastItem && new URL(`${host}/${path}`);

        if (nextUrl) {
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (
                        key !== 'where__id__more_than' &&
                        key !== 'where__id__less_than'
                    )
                        nextUrl.searchParams.append(key, dto[key]);
                }
            }
            let key = null;

            if (dto.order__createdAt === 'ASC') {
                key = 'where__id__more_than';
            }
            if (dto.order__createdAt === 'DESC') {
                key = 'where__id__less_than';
            }

            nextUrl.searchParams.append(key, lastItem.id.toString());
        }

        return {
            //페이지 Datas
            datas: results,
            cursor: {
                after: lastItem?.id || null,
            },
            count: results.length,
            next: nextUrl?.toString() ?? null,
        };
    }

    private async pagePaginate<T extends BaseModel>(
        dto: PagePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
    ) {
        const findOptions = this.composeFindOptions<T>(dto);

        const [datas, total] = await repository.findAndCount({
            ...findOptions,
            ...overrideFindOptions,
        });

        return {
            //페이지 Datas
            datas,
            total,
            curpage: !isNaN(+dto.page) && +dto.page,
        };
    }

    //구성
    private composeFindOptions<T extends BaseModel>(
        dto: PaginatePostDto | PagePaginationDto,
    ): FindManyOptions<T> {
        //구성요소
        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};

        for (const [key, value] of Object.entries(dto)) {
            if (key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                };
            } else if (key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseWhereFilter(key, value),
                };
            }
        }

        //Page기반 이면 Skip 할당하기
        let skip: number | undefined;

        //Page 페이지네이션일 경우 Chk
        if ('page' in dto) {
            skip = dto.take * (dto.page - 1);
        }

        return {
            where,
            order,
            take: dto.take,
            skip,
        };
    }

    private parseWhereFilter<T extends BaseModel>(
        key: string,
        value: string,
    ): FindOptionsWhere<T> | FindOptionsOrder<T> {
        const options: FindOptionsWhere<T> = {};

        const split = key.split('__');
        console.log(split);

        if (split.length !== 2 && split.length !== 3) {
            throw new BadRequestException('잘못된 요청입니다.');
        }

        const [_, id, operator] = split;

        if (!operator) {
            options[id] = value;
        } else if (operator) {
            const filterFn = FILTER_MAPPER[operator];
            if (!filterFn) {
                throw new BadRequestException('잘못된 요청입니다.');
            }

            options[id] = filterFn(value);
        }

        return options;
    }
}
