import {
    BadRequestException,
    ClassSerializerInterceptor,
    Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from 'src/posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from 'src/users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
    ENV_DB_DATABASE,
    ENV_DB_HOST,
    ENV_DB_PASSWORD,
    ENV_DB_PORT,
    ENV_DB_USERNAME,
} from 'src/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from 'src/common/const/path.const';

@Module({
    imports: [
        PostsModule,
        //도메인 신경x
        ServeStaticModule.forRoot({
            rootPath: PUBLIC_FOLDER_PATH,
            serveRoot: '/public',
        }),
        ServeStaticModule.forRoot({
            rootPath: PUBLIC_FOLDER_PATH,
            serveRoot: '/temp',
        }),

        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env[ENV_DB_HOST],
            port: parseInt(process.env[ENV_DB_PORT]),
            username: process.env[ENV_DB_USERNAME],
            password: process.env[ENV_DB_PASSWORD],
            database: process.env[ENV_DB_DATABASE],
            entities: [PostModel, UsersModel],
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    ],
})
export class AppModule {}
