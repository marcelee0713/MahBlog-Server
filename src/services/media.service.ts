import { injectable } from "inversify";
import { IMediaService } from "../interfaces/media.interface";
import cloudinary from "../config/cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import { CustomError } from "../utils/error_handler";

@injectable()
export class MediaService implements IMediaService {
  private media: typeof cloudinary;

  constructor() {
    this.media = cloudinary;
  }
  async uploadImage(userId: string, path: string, folderPath: string = `/`): Promise<string> {
    const defaultFolderPath = `/mahblog/user_media/${userId}${folderPath}`;
    try {
      const image = await this.media.uploader.upload(path, {
        folder: defaultFolderPath,
        resource_type: "image",
      });

      return image.secure_url;
    } catch (err) {
      throw new CustomError("media-service-error");
    }
  }

  async removeImage(imageUrl: string): Promise<void> {
    try {
      const publicId = extractPublicId(imageUrl);

      await this.media.uploader.destroy(publicId);
    } catch (err) {
      throw new CustomError("media-service-error");
    }
  }
}
