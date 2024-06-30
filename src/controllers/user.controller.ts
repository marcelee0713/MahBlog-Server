import { Request, Response } from "express";

export class UserController {
  async onSignIn(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }
}
