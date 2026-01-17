/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MulterModule.register({ storage: multer.memoryStorage() }),
  ],
  controllers: [BlogController],
  providers: [BlogService, CloudinaryService],
})
export class BlogModule {}
