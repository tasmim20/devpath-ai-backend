export class CreateBlogDto {
  title: string;
  content: string;
  author?: string;
  published?: boolean;
}
