import {
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.length > 8) {
            throw new BadRequestException('8글자 이하 불가합니다');
        }

        return value.toString();
    }
}
