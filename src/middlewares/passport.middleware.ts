import { inject, injectable } from "inversify";
import { TYPES } from "../constants";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { IUserService } from "../ts/interfaces/user/user.interface";
import { CustomError } from "../utils/error_handler";
import { IUserProfileService } from "../ts/interfaces/user/user.profile.interface";
import { safeExecute } from "../utils";

@injectable()
export class PassportService {
  private userService: IUserService;
  private userProfileService: IUserProfileService;

  constructor(
    @inject(TYPES.UserService) userService: IUserService,
    @inject(TYPES.UserProfileService) userProfileService: IUserProfileService
  ) {
    this.userService = userService;
    this.userProfileService = userProfileService;
  }

  initializeGoogleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
          scope: ["email", "profile"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile._json.email;
            const firstName = profile._json.given_name;
            const lastName = profile._json.family_name;

            if (!email) {
              throw new CustomError(
                "invalid-email",
                "Google Email does not exist, please try a different account"
              );
            }

            if (!firstName) {
              throw new CustomError(
                "invalid-first-name",
                "Google Name doesn't have any given name, please try a different account"
              );
            }

            const user = await safeExecute(
              this.userService.getUserByEmail.bind(this.userService),
              email
            );

            if (user) return done(null, user);

            const newUser = await this.userService.signUp({
              email,
              firstName: firstName,
              lastName: lastName,
              authAs: "GOOGLE",
            });

            await this.userService.verifyEmail(newUser.userId, email);

            if (profile.name && profile.name.middleName) {
              await this.userProfileService.updateName(
                newUser.userId,
                firstName,
                lastName,
                profile.name.middleName
              );
            }

            return done(null, newUser);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }
}
