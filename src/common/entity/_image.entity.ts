import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { join } from 'path';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

enum ImageModelType {
    POST_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
    @Column({ default: 0 })
    @IsInt()
    @IsOptional()
    order: number;

    @Column({ enum: ImageModelType })
    @IsEnum(ImageModelType)
    // @IsString() <-딱히
    type: ImageModelType;

    @Column()
    @IsString()
    @Transform(({ value, obj }) => {
        if (obj.type === ImageModelType.POST_IMAGE) {
            return join(POST_IMAGE_PATH, value);
        }
    })
    path: string;

    // @ManyToOne(() => PostModel, (post) => post.images)
    // post?: PostModel;
}
