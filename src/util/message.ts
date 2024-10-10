import { ValidationArguments } from 'class-validator';

export class Message {
    constructor(private field: string) {}

    length(min: number, max: number): string {
        return `${this.field}의 길이는 ${min}~${max}자로 허용됩니다.`;
    }

    invalidEmail(): string {
        return `유효하지 않은 ${this.field} 형식입니다.`;
    }
}

export const vaildateMessage = () => {
    return {
        vaildateEmail: (arg: ValidationArguments) => {
            return `${arg.property}형식을 확인해주세요.`;
        },
        validateLength: (arg: ValidationArguments) => {
            return `${arg.property}은 ${arg.constraints[0]}~${arg.constraints[1]}글자를 입력해주세요.`;
        },
    };
};
