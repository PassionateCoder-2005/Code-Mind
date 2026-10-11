import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";
import CONFIG from "./config.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: CONFIG.GOOGLE_CLIENT_ID,
            clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
            callbackURL: CONFIG.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(null, false, {
                        message: "Google account email not available"
                    });
                }

                let user = await userModel.findOne({ email });

                if (!user) {
                    user = await userModel.create({
                        name: profile.displayName || "Google User",
                        email,
                        googleId: profile.id
                    });
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;