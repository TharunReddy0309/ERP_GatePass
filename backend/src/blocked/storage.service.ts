import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly endpoint: string;

    constructor() {
        this.bucket = process.env.NEON_STORAGE_BUCKET ?? 'gatepass';
        this.endpoint = process.env.NEON_STORAGE_ENDPOINT ?? '';
        this.client = new S3Client({
            region: process.env.NEON_STORAGE_REGION ?? 'us-east-2',
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.NEON_STORAGE_SECRET_ACCESS_KEY ?? '',
            },
            forcePathStyle: true,
        });
    }

    async uploadImage(buffer: Buffer, mimeType: string): Promise<string> {
        const ext = mimeType.split('/')[1] ?? 'jpg';
        const key = `proxy-photos/${uuidv4()}.${ext}`;
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: mimeType,
            }),
        );
        return `${this.endpoint}/${this.bucket}/${key}`;
    }
}

