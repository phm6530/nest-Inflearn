import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';

export class PasswordPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {}
}
