import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import * as multer from 'multer';
import { TEMP_IMAGE_PATH } from 'src/common/const/path.const';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        MulterModule.register({
            limits: {
                fieldSize: 1000000,
            },
            //파일 유효성검사
            fileFilter: (req, file, cb) => {
                console.log('!!!!');
                /**
                 * cb(에러, boolean)
                 *
                 * 첫번쨰 파라미터에는 에러가 있을경우 에러정보를 넣어준다.
                 * 두번째 파라미터는 파일을 받을지 말지 boolean 을 넣어준다.
                 *
                 */

                //확장자 따기
                const ext = extname(file.originalname);

                //확장자 맞지않으면 에러 반환
                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return cb(
                        new BadRequestException('취급하는 확장자가 아닙니다.'),
                        false,
                    );
                }

                return cb(null, true);
            },
            //파일 어디로 보내는지
            storage: multer.diskStorage({
                /**
                 * cb(에러, 저장경로)
                 * 첫 번째 파라미터는 에러 정보를 넘겨줍니다.
                 * 두 번째 파라미터는 파일을 저장할 경로를 넘겨줍니다.
                 * url아님 폴더경로임
                 */
                destination: function (req, file, cb) {
                    // if (!fs.existsSync(POST_IMAGE_PATH)) {
                    //     fs.mkdirSync(POST_IMAGE_PATH, { recursive: true }); //하위폴더도 생성
                    // }

                    cb(null, TEMP_IMAGE_PATH);
                },
                /**
                 * cb(에러, 파일이름)
                 * 첫 번째 파라미터는 에러 정보를 넘겨줍니다.
                 * 두 번째 파라미터는 저장할 파일명을 넘겨줍니다.
                 */
                filename: function (req, file, cb) {
                    //새로운 파일명
                    cb(null, `${uuid()}-${extname(file.originalname)}`);
                },
            }),
        }),
    ],
    controllers: [CommonController],
    exports: [CommonService],
    providers: [CommonService],
})
export class CommonModule {}
