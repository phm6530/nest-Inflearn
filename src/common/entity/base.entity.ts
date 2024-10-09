import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

//Base Url 생성
export abstract class BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    updateAt: Date;

    @CreateDateColumn()
    createAt: Date;
}
