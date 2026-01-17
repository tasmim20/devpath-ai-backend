// src/blog/blog.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createBlog(
    @Body() body: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.create(body, file);
  }

  @Get()
  getAllBlogs() {
    return this.blogService.findAll();
  }

  @Get(':id')
  getSingleBlog(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Put(':id')
  updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    return this.blogService.update(id, body);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
