import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserService } from "../interfaces/user.interface";
import { TYPES } from "../constants";

@injectable()
export class UserController {
  private service: IUserService;

  constructor(@inject(TYPES.UserService) service: IUserService) {
    this.service = service;
  }

  async onSignIn(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }

  async onSignOut(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }

  async onSignUp(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }

  async onGetUser(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    res.status(200).json({
      data: "Wassup nigga",
    });
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
