import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireRole } from "../middleware/auth";
import {
  validateRequestBody,
  validateResponseBody,
} from "../middleware/validatation";
import userSchema from "../schemas/src/user-schema";
import { extend } from "../utils/express-extension";

const authRouter = extend(Router());

const prisma = new PrismaClient();

authRouter.get(
  "/api/auth/current-user",
  requireRole(null),
  validateRequestBody(null),
  validateResponseBody(userSchema),
  async (req, res) => {
    const { userId: idInAuthService } = getAuth(req);

    if (!idInAuthService) {
      res.send(null);
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        idInAuthService,
      },
      include: {
        avatar: true,
      },
    });

    if (!user) {
      res.send(null);
      return;
    }

    res.send(user);
  }
);

export default authRouter;
