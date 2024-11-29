import { injectable } from "inversify";
import { IBlogContents } from "../../ts/interfaces/blog/blog.contents.interface";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class BlogContents implements IBlogContents {
  validateBlogContentTitle(title: string) {
    if (title.length > 80)
      throw new CustomError("invalid", "Invalid description, maximum of 150 characters only.");
  }
}
