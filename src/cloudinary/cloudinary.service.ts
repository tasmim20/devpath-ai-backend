/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        return reject(new Error('File buffer is missing'));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'blogs' },
        (error, result: UploadApiResponse | undefined) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No response from Cloudinary'));
          resolve(result.secure_url);
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
