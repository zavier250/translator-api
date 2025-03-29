import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config"; // Assuming config is a separate file for your credentials
import { findUserOrCreateAccountForGoogleUser } from "../services/user.service";
import { IUser, IUserModel, User } from "../models/User";
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleOauthClient,
      clientSecret: config.googleSecret,
      callbackURL: config.googleRedirectUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth Profile:", profile);

        if (profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;

          const user = await findUserOrCreateAccountForGoogleUser(
            email,
            profile.id,
            profile.displayName
          );

          if (user) {
            return done(null, user); // Successfully authenticated or created user
          } else {
            return done(null, false, {
              message: "User authentication failed.",
            });
          }
        } else {
          return done(null, false, { message: "Email not found in profile." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  done(null, { id });
});

export default passport;
