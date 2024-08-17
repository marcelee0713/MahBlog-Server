import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IBlogService } from "../../interfaces/blog/blog.interface";
import { TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import {
  GetBlogsBodyReq,
  UpdateBlogBodyReq,
  UpdateBlogImageUseCase,
} from "../../types/blog/blog.types";
import { IMediaService } from "../../interfaces/media.interface";

@injectable()
export class BlogController {
  private service: IBlogService;
  private media: IMediaService;

  constructor(
    @inject(TYPES.BlogService) service: IBlogService,
    @inject(TYPES.MediaService) media: IMediaService
  ) {
    this.service = service;
    this.media = media;
  }

  async onCreateBlog(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;

      const data = this.service.createBlog(userId);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetBlogs(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;

      const body: GetBlogsBodyReq = {
        body: { ...req.body, userId },
      };

      const data = await this.service.getBlogs(body.body);

      return res.status(200).json(FormatResponseArray(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetBlog(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const authorId = req.body.authorId as string;
      const blogId = req.body.blogId as string;

      const data = await this.service.getBlogInfo(userId, authorId, blogId);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onEditBlog(req: Request, res: Response) {
    // TODO: If the inputs are null, it is meant for it to be removed.
    try {
      const updateImageMode = req.body.updateImageMode as UpdateBlogImageUseCase;
      const blogId = req.body.blogId;
      const userId = res.locals.userId as string;
      let imageUrl: string | undefined | null = undefined;

      const tags = req.body.tags as string | undefined;

      const parsedTags: string[] | undefined = tags
        ? tags.split(", ")
        : typeof tags === "string"
          ? []
          : undefined;

      if (updateImageMode === "CHANGE") {
        if (!req.file)
          throw new CustomError(
            "invalid-image-upload",
            "Please enter an image when using this mode."
          );

        const blogInfo = await this.service.getBlogInfo(userId, userId, blogId);

        if (blogInfo.coverImage) await this.media.removeImage(blogInfo.coverImage);

        imageUrl = await this.media.uploadImage(
          userId,
          req.file.path,
          `/blogs/${blogInfo.blogId}/`
        );
      }

      if (updateImageMode === "REMOVE") {
        const blogInfo = await this.service.getBlogInfo(userId, userId, blogId);

        if (blogInfo.coverImage) await this.media.removeImage(blogInfo.coverImage);

        imageUrl = null;
      }

      const body: UpdateBlogBodyReq = {
        body: { ...req.body, userId, tags: parsedTags, coverImage: imageUrl },
      };

      const data = await this.service.editBlog(body.body);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteBlog(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const blogId = req.body.blogId as string;

      const data = await this.service.deleteBlog(userId, blogId);

      for (let i = 0; i < data.length; i++) {
        const image = data[i];

        await this.media.removeImage(image);
      }

      return res.status(200).json(FormatResponse({}, "Blog have been deleted and its images."));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
