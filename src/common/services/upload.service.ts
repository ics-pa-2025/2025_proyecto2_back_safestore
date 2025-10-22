import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly uploadPath = path.join(process.cwd(), 'public', 'images');

    constructor() {
        this.ensureUploadDirectory();
    }

    private ensureUploadDirectory(): void {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    generateFileName(originalName: string): string {
        const ext = extname(originalName);
        const uuid = uuidv4();
        return `${uuid}${ext}`;
    }

    getImageUrl(filename: string): string {
        return `/images/${filename}`;
    }

    getFilePath(filename: string): string {
        return path.join(this.uploadPath, filename);
    }

    deleteFile(filename: string): void {
        const filePath = this.getFilePath(filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    isValidImageFile(mimetype: string): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return allowedTypes.includes(mimetype);
    }
}