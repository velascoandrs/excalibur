import { ModuleMetadata } from '@nestjs/common/interfaces';
import { StorageOptions, CreateWriteStreamOptions } from '@google-cloud/storage';

export interface GoogleCloudStorageOptions extends StorageOptions {
    bucketDefaultName: string;
    storageBaseUri?: string;
}

export interface GoogleCloudStoragePerRequestOptions extends GoogleCloudStorageOptions {
    writeStreamOptions?: CreateWriteStreamOptions;
    prefix?: string;
}

export type AsyncFactory = (...args: any[]) => Promise<GoogleCloudStorageOptions> | GoogleCloudStorageOptions;

export interface GoogleCloudStorageAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: AsyncFactory;
    inject?: any[];
}


export interface UploadedFileMetadata {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: string;
    storageUrl?: string;
}