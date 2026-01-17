// src/blog/blog.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './blog.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(data: CreateBlogDto, file?: Express.Multer.File) {
    let imageUrl = '';

    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

    const created = new this.blogModel({ ...data, imageUrl });
    return created.save();
  }

  findAll() {
    return this.blogModel.find().sort({ createdAt: -1 });
  }

  findOne(id: string) {
    return this.blogModel.findById(id);
  }

  update(id: string, data: UpdateBlogDto) {
    return this.blogModel.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return this.blogModel.findByIdAndDelete(id);
  }
}
