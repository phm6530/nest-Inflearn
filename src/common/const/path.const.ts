import { join } from 'path';

//ROot 절대경로 추출
export const PROJECT_ROOT_PATH = process.cwd();

//외부 접근 가능 파일들 모아논 폴더이름
export const PUBLIC_FOLDER_NAME = 'public';
export const TEMP_FOLDER_NAME = 'temp';

// 포스트 이미지들을 저장할 폴더이름

export const POSTS_FOLDER_NAME = 'posts';

//경로 생성
// ex) root/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
export const TEMP_FOLDER_PATH = join(PROJECT_ROOT_PATH, TEMP_FOLDER_NAME);

//포스트 이미지 저장할 폴더
// ex) root/public/posts
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);
export const TEMP_IMAGE_PATH = join(TEMP_FOLDER_PATH, POSTS_FOLDER_NAME);

// ex) 접근가능 퍼블릭 Path root/public/posts
export const POST_PUBLIC_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    POSTS_FOLDER_NAME,
);

export const TEMP_PUBLIC_IMAGE_PATH = join(TEMP_FOLDER_NAME, POSTS_FOLDER_NAME);
