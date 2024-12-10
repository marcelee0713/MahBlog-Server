import { inject, injectable } from "inversify";
import { IUserProfileService } from "../../ts/interfaces/user/user.profile.interface";
import { TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import { Request, Response } from "express";
import { FormatResponse } from "../../utils/response_handler";
import { IMediaService } from "../../ts/interfaces/media.interface";
import { IUserLogsService } from "../../ts/interfaces/user/user.logs.interface";

@injectable()
export class UserProfileController {
  private service: IUserProfileService;
  private media: IMediaService;
  private logs: IUserLogsService;

  constructor(
    @inject(TYPES.UserProfileService) service: IUserProfileService,
    @inject(TYPES.MediaService) media: IMediaService,
    @inject(TYPES.UserLogsService) logs: IUserLogsService
  ) {
    this.service = service;
    this.media = media;
    this.logs = logs;
  }

  async onGetUserProfileData(req: Request, res: Response) {
    try {
      const userId = req.params.userId ?? (res.locals.userId as string);

      const data = await this.service.getUserProfile(userId);

      return res.status(200).json(FormatResponse(data, "User profile data."));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetUserProfileDataByEmail(req: Request, res: Response) {
    try {
      const userId = req.body.email as string;

      if (!req.body.email) throw new CustomError("missing-inputs");

      const data = await this.service.getUserProfileByEmail(userId);

      return res.status(200).json(FormatResponse(data, "Minimized profile data."));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateName(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const fName = req.body.firstName as string;
      const mName: string | undefined = req.body.middleName;
      const lName = req.body.lastName as string;

      const updateable = await this.logs.updateable(userId, "UPDATE_NAME");

      if (!updateable) throw new CustomError("user-modification-denied");

      await this.service.updateName(userId, fName, lName, mName);

      await this.logs.addLog(userId, "UPDATE_NAME");
      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateBio(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const bio = req.body.bio as string | undefined;

      if (!bio) {
        await this.service.remove(userId, "BIO");

        return res.status(200).json(FormatResponse({}, "Removed bio"));
      }

      await this.service.updateBio(userId, bio);

      return res.status(200).json(FormatResponse({}, "Updated bio"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateProfilePicture(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const file = req.file;

      if (!file) throw new CustomError("invalid-image-upload");

      const user = await this.service.getUserProfile(userId);

      if (!user.profilePicture) {
        const url = await this.media.uploadImage(user.userId, file.path, "/profile");

        await this.service.updateProfileImage(userId, url);

        return res.status(200).json(
          FormatResponse({
            imageUrl: url,
          })
        );
      }

      await this.media.removeImage(user.profilePicture);

      const url = await this.media.uploadImage(user.userId, file.path, "/profile");

      await this.service.updateProfileImage(user.userId, url);

      return res.status(200).json(
        FormatResponse(
          {
            imageUrl: url,
          },
          "Removed old image"
        )
      );
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateCoverPicture(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const file = req.file;

      if (!file) throw new CustomError("invalid-image-upload");

      const user = await this.service.getUserProfile(userId);

      if (!user.profileCover) {
        const url = await this.media.uploadImage(user.userId, file.path, "/profile");

        await this.service.updateCoverImage(userId, url);

        return res.status(200).json(
          FormatResponse({
            imageUrl: url,
          })
        );
      }

      await this.media.removeImage(user.profileCover);

      const url = await this.media.uploadImage(user.userId, file.path, "/profile");

      await this.service.updateCoverImage(user.userId, url);

      return res.status(200).json(
        FormatResponse({
          imageUrl: url,
        })
      );
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onRemoveProfilePicture(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const image = req.body.image as string;

      await this.media.removeImage(image);

      await this.service.remove(userId, "PROFILE_IMAGE");

      return res.status(200).json(FormatResponse({}, "Removed user profile picture"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onRemoveProfileCover(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const image = req.body.image as string;

      await this.media.removeImage(image);

      await this.service.remove(userId, "COVER_IMAGE");

      return res.status(200).json(FormatResponse({}, "Removed user profile cover"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
