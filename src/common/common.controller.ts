import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('common')
export class CommonController {
    constructor(private readonly commonService: CommonService) {}

    //이미지 엔드포인트
    @Post('image')
    //file인지 files인지 확인...
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(AccessTokenGuard)
    UploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('이미지 파일이 누락되었습니다.');
        }

        return {
            image: file?.filename,
        };
    }
}
