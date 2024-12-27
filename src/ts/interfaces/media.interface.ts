export interface IMediaService {
  uploadImage: (userId: string, path: string, folderPath?: string) => Promise<string>;
  removeImage: (imageUrl: string) => Promise<void>;
  removeUserDirectory: (userId: string, images: string[]) => Promise<void>;
}
