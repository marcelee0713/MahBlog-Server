import { injectable } from "inversify";
import { IMediaService } from "../ts/interfaces/media.interface";
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

  async removeUserDirectory(userId: string, images: string[]): Promise<void> {
    try {
      const publicIds = images.map((image) => extractPublicId(image));

      const chunkSize = 100;
      const chunks = [];

      for (let i = 0; i < publicIds.length; i += chunkSize) {
        chunks.push(publicIds.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        await this.media.api.delete_resources(chunk);
      }

      await this.media.api.delete_folder(`/mahblog/user_media/${userId}`);
    } catch (err) {
      throw new CustomError("media-service-error");
    }
  }
}
