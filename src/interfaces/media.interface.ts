export interface IMediaService {
  uploadImage: (userId: string, path: string) => Promise<string>;
  removeImage: (imageUrl: string) => Promise<void>;
}
