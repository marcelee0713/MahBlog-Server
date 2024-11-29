import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IBlogContentsService } from "../../ts/interfaces/blog/blog.contents.interface";
import { TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import { IMediaService } from "../../ts/interfaces/media.interface";
import { UpdateBlogContentsBodyReq } from "../../ts/types/blog/blog.contents.types";
import { UpdateBlogImageUseCase } from "../../ts/types/blog/blog.types";

@injectable()
export class BlogContentsController {
  private service: IBlogContentsService;
  private media: IMediaService;

  constructor(
    @inject(TYPES.BlogContentsService) service: IBlogContentsService,
    @inject(TYPES.MediaService) media: IMediaService
  ) {
    this.service = service;
    this.media = media;
  }

  async onCreateBlogContent(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const blogId = req.body.blogId as string;

      const data = await this.service.createBlogContent(userId, blogId);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetBlogContents(req: Request, res: Response) {
    try {
      const blogId = req.body.blogId as string;

      const data = await this.service.getBlogContents(blogId);

      return res.status(200).json(FormatResponseArray(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateBlogContents(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const index = req.body.index as string | undefined;
      const updateImageMode = req.body.updateImageMode as UpdateBlogImageUseCase;
      let imageUrl: string | undefined | null = undefined;

      const body: UpdateBlogContentsBodyReq = {
        body: { ...req.body, userId, index: index && parseInt(index) },
      };

      if (updateImageMode === "CHANGE") {
        if (!req.file)
          throw new CustomError(
            "invalid-image-upload",
            "Please enter an image when using this mode."
          );

        const userId = body.body.userId;
        const blogId = body.body.blogId;
        const blogContentId = body.body.blogContentId;

        const data = await this.service.getBlogContent(blogId, blogContentId);

        if (data.contentImage) await this.media.removeImage(data.contentImage);

        imageUrl = await this.media.uploadImage(
          userId,
          req.file.path,
          `/blogs/${data.blogId}/contents`
        );

        body.body.contentImage = imageUrl;
      }

      if (updateImageMode === "REMOVE") {
        const blogId = body.body.blogId;
        const blogContentId = body.body.blogContentId;

        const data = await this.service.getBlogContent(blogId, blogContentId);

        if (data.contentImage) await this.media.removeImage(data.contentImage);

        imageUrl = null;

        body.body.contentImage = imageUrl;
      }

      const data = await this.service.editBlogContent(body.body);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteContent(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const blogId = req.body.blogId as string;
      const blogContentId = req.body.blogContentId as string;

      const image = await this.service.deleteContent({ userId, blogId, blogContentId });

      if (image) await this.media.removeImage(image);

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
