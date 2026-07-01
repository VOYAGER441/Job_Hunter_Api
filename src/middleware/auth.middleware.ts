import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwtOperation"; // adjust path to match your jwt util location
import { Log } from "@/utils/logger"; // adjust to match your actual logger import

class AuthMiddleware {
    /**
     * Verifies the access token from the Authorization header.
     * Attaches the decoded user payload to req.user on success.
     */
    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                Log.info("AuthMiddleware::::authenticate:::: missing or malformed Authorization header");
                res.status(401).json({ message: "Authentication token is required" });
                return;
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                res.status(401).json({ message: "Authentication token is required" });
                return;
            }
            
            const decoded = verifyAccessToken(token);

            // attach decoded user to request for downstream handlers
            (req as any).user = decoded.user;

            next();
        } catch (err) {
            Log.info("AuthMiddleware::::authenticate:::: token verification failed - " + (err as Error).message);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    };

    /**
     * Optional authentication, doesn't reject if no token is present,
     * but attaches req.user if a valid token IS provided.
     * Useful for routes that behave differently for logged-in vs anonymous users.
     */
    public optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return next();
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return next();
            }

            const decoded = verifyAccessToken(token);
            (req as any).user = decoded.user;

            next();
        } catch (err) {
            // invalid token on an optional route, just proceed unauthenticated
            Log.info("AuthMiddleware::::optionalAuthenticate:::: token verification failed - " + (err as Error).message);
            next();
        }
    };

    /**
     * Role-based access control, use AFTER authenticate().
     * Example: router.get('/admin', authMiddleware.authenticate, authMiddleware.requireRole('admin'), handler)
     */
    public requireRole = (...allowedRoles: string[]) => {
        return (req: Request, res: Response, next: NextFunction): void => {
            const user = (req as any).user;

            if (!user || !user.role) {
                res.status(403).json({ message: "Access denied" });
                return;
            }

            if (!allowedRoles.includes(user.role)) {
                Log.info(`AuthMiddleware::::requireRole:::: user role '${user.role}' not in allowed roles [${allowedRoles.join(", ")}]`);
                res.status(403).json({ message: "Insufficient permissions" });
                return;
            }

            next();
        };
    };
}

export default new AuthMiddleware();