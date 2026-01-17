import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl: string;

  @Prop()
  author: string;

  @Prop({ default: false })
  published: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
