import { clerkClient, getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireRole } from "../middleware/auth";
import {
  validateRequestBody,
  validateResponseBody,
} from "../middleware/validatation";
import accountUpdateSchema from "../schemas/src/account-update-schema";
import { extend } from "../utils/express-extension";

const accountRouter = extend(Router());

const prisma = new PrismaClient();

accountRouter.put(
  "/api/account/complete-setup",
  requireRole(null),
  validateRequestBody(accountUpdateSchema),
  validateResponseBody(null),
  async (req, res) => {
    const { userId: idInAuthService } = getAuth(req);

    if (!idInAuthService) {
      throw new Error("Missing Clerk authentication.");
    }

    const clerkUser = await clerkClient.users.getUser(idInAuthService);

    if (!clerkUser.primaryPhoneNumber?.phoneNumber) {
      throw new Error("Clerk user missing phone number.");
    }

    const { avatar, ...body } = req.body;

    const data = {
      ...body,
      phoneNumber: clerkUser.primaryPhoneNumber.phoneNumber,
      idInAuthService,
      role: { connect: { name: "USER" } },
    } as const;

    await prisma.user.upsert({
      create: {
        ...data,
        avatar: { create: avatar },
      },
      update: {
        ...data,
        avatar: { update: avatar },
      },
      where: {
        idInAuthService: idInAuthService,
      },
    });

    res.send(null);
  }
);

export default accountRouter;
