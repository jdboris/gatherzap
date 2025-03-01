import { clerkMiddleware, getAuth } from "@clerk/express";
import { PrismaClient, RoleName } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Responds with `401` if authentication is missing or `403` if the user lacks the required role.
 *
 * @param {RoleName} role - The role to require, or `null` for "no authentication required".
 * @example
 * app.get("/route-1", requireRole("ADMIN"), (req, res) => { ... });
 */
export const requireRole = (role: RoleName | null) => {
  const requireRoleMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    clerkMiddleware()(req, res, async (err?: any) => {
      if (!role) {
        next();
        return;
      }

      if (err) {
        next(err);
        return;
      }

      const { userId: idInAuthService } = getAuth(req);

      if (!idInAuthService) {
        res.status(401).send();
        return;
      }

      const user = await prisma.user.findFirst({
        where: {
          idInAuthService,
        },
        include: { role: true },
      });

      if (!user) {
        res.status(401).send();
        return;
      }

      if (user.role.name != role) {
        res.status(403).send();
        return;
      }

      next();
    });
  };

  Object.setPrototypeOf(requireRoleMiddleware, RequireRoleMiddleware.prototype);

  if (!(requireRoleMiddleware instanceof RequireRoleMiddleware)) {
    throw new Error("Something went wrong.");
  }

  return requireRoleMiddleware;
};

export class RequireRoleMiddleware {
  // Suppress the warning since this is intentional
  // @ts-ignore
  readonly __brand: "RequireRoleMiddleware";
}
