import { injectable } from "inversify";
import { IBlog } from "../../ts/interfaces/blog/blog.interface";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class Blog implements IBlog {
  validateBlogTitle(title: string) {
    if (title.length > 80)
      throw new CustomError("invalid", "Invalid title, maximum of 80 characters only.");
  }

  validateBlogDesc(description: string) {
    if (description.length > 150)
      throw new CustomError("invalid", "Invalid description, maximum of 150 characters only.");
  }

  validateTags(tags?: string[]) {
    if (!tags) return tags;

    for (let i = 0; i < tags.length; i++) {
      if (tags[i].length > 150)
        throw new CustomError("invalid", `Invalid tag ${tags[i]} , maximum of 50 characters only.`);
    }

    return Array.from(new Set(tags));
  }
}
