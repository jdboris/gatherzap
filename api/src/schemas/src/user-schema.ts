import { z } from "zod";
import { subYears } from "date-fns";
import avatarSchema from "./avatar-schema";

const userSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.date().max(subYears(new Date(), 13)),
  // NOTE: Validated by Clerk
  phoneNumber: z.string().min(1),
  avatar: avatarSchema,
});

export default userSchema;

export type UserSchema = z.infer<typeof userSchema>;
