import { IBlog } from "../../interfaces/blog/blog.interface";
import { CustomError } from "../../utils/error_handler";

export class Blog implements IBlog {
  validateBlogTitle(title: string) {
    if (title.length > 80)
      throw new CustomError("invalid", "Invalid title, maximum of 80 characters only.");
  }

  validateBlogDesc(description: string) {
    if (description.length > 150)
      throw new CustomError("invalid", "Invalid description, maximum of 150 characters only.");
  }

  validateTag(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].length > 150)
        throw new CustomError("invalid", `Invalid tag ${tags[i]} , maximum of 50 characters only.`);
    }
  }
}
