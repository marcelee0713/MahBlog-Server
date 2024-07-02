import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserService } from "../interfaces/user/user.interface";
import { TYPES } from "../constants";
import { identifyErrors } from "../utils/error_handler";
import { FormatResponse } from "../utils/response_handler";

@injectable()
export class UserController {
  private service: IUserService;

  constructor(@inject(TYPES.UserService) service: IUserService) {
    this.service = service;
  }

  async onSignIn(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const token = await this.service.signIn(email, password);

      return res.set("Authorization", `Bearer ${token}`).status(200).json({});
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onSignOut(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }

  async onSignUp(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;

      await this.service.signUp({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      return res.status(200).json({});
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onGetUser(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const token = res.locals.token;

      const data = await this.service.getUser(userId);

      return res.set("Authorization", `Bearer ${token}`).status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onUpdateUser(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }

  async onDeleteUser(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }
}
