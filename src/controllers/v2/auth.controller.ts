

import { AppError } from "@/error/AppError";
import authService from "@/services/auth.service";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import validations from "@/validations";
import appwriteService from "@/services/appwrite.service";
import { Request, Response } from "express";
import env from "@/environment";

class AuthController {

    async jwtVerify(req: Request, res: Response) {
        const { jwtFromAppwrite } = req.params;
        const { error } = validations.authValidation.jwtVerifySchema.validate({ jwtFromAppwrite });
        if (error) {
            Log.error("AuthController:::jwtVerify:::: need Appwrite JWT validation", error)
            throw new AppError(error.details[0].message, utils.http.HttpStatusCodes.BAD_REQUEST);
        }
        const result = await authService.jwtVerify(jwtFromAppwrite);
        Log.info("AuthController:::jwtVerify:::: need Appwrite JWT validation", result)
        res.status(utils.http.HttpStatusCodes.OK).json(result);
    }

    async googleLogin(req: Request, res: Response) {
        Log.info("AuthController:::googleLogin:::: calling createGoogleLoginRedirectURL");
        const { redirectUri } = req.query;
        const host = req.get("host");
        const fallbackAppUrl = host ? `${req.protocol}://${host}` : undefined;
        const url = await appwriteService.createGoogleLoginRedirectURL(
            redirectUri as string,
            fallbackAppUrl
        );
        Log.info("AuthController:::googleLogin:::: createGoogleLoginRedirectURL result", url);

        // Return JSON so frontend can handle the browser open
        res.status(utils.http.HttpStatusCodes.OK).json({ url });
    }

    async oauthCallback(req: Request, res: Response) {
        Log.info("AuthController:::oauthCallback:::: received callback", req.query);
        const { secret, userId, redirectUri } = req.query;

        // Determine the base schema/URL
        // If frontend sent a specific redirectUri (e.g. exp://...), use it
        // Otherwise default to the production scheme (sheild://)
        let deepLinkBase = `${env.FRONTEND_URL}/oauth/callback`;
        if (redirectUri) {
            deepLinkBase = decodeURIComponent(redirectUri as string);
        }

        // Add the auth params
        const separator = deepLinkBase.includes("?") ? "&" : "?";
        const deepLink = `${deepLinkBase}${separator}userId=${userId}&secret=${secret}`;

        Log.info("AuthController:::oauthCallback:::: redirecting to deep link", deepLink);

        // Return an HTML page that redirects
        res.redirect(deepLink);
    }

    async logout(req: Request, res: Response) {
        // TODO: implement logout logic
    }
}

export default new AuthController();