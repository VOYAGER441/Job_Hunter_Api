import env from "@/environment";
import { IJwtRequest } from "@/interface/request/jwt.request";
import jwt, { SignOptions } from "jsonwebtoken";


interface IDecodedToken {
    user: IJwtRequest;
    type: "access" | "refresh";
    iat: number;
    exp: number;
}

// get access token
export function generateAccessToken(user: IJwtRequest) {
    return jwt.sign({ user, type: "access" }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    });
}

// get refresh token
export function generateRefreshToken(user: IJwtRequest) {
    return jwt.sign({ user, type: "refresh" }, env.JWT_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
    });
}


export function verifyAccessToken(token: string): IDecodedToken {
    const decoded = jwt.verify(token, env.JWT_SECRET) as IDecodedToken;

    if (decoded.type !== "access") {
        throw new Error("Invalid token type: expected access token");
    }

    return decoded;
}

// verify and decode refresh token
export function verifyRefreshToken(token: string): IDecodedToken {
    const decoded = jwt.verify(token, env.JWT_SECRET) as IDecodedToken;

    if (decoded.type !== "refresh") {
        throw new Error("Invalid token type: expected refresh token");
    }

    return decoded;
}
