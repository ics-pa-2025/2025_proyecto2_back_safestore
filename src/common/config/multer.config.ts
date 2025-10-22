import { BadRequestException, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    private generateFileName(originalName: string): string {
        const ext = extname(originalName);
        const uuid = uuidv4();
        return `${uuid}${ext}`;
    }

    private isValidImageFile(mimetype: string): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return allowedTypes.includes(mimetype);
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, './public/images');
                },
                filename: (req, file, cb) => {
                    const filename = this.generateFileName(file.originalname);
                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!this.isValidImageFile(file.mimetype)) {
                    cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
                    return;
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        };
    }
}