import { z } from "zod";
import { subYears } from "date-fns";
import avatarSchema from "./avatar-schema";

const accountSchema = z.object({
  fullName: z
    .string({
      message: "Please enter your full name.",
    })
    .min(1, { message: "Please enter your full name." }),
  birthDate: z.coerce
    .date({
      message: "Please enter your date of birth.",
      // NOTE: `invalid_type_error` is still broken (see: https://github.com/colinhacks/zod/issues/1526)
      // invalid_type_error: "Please enter your date of birth.",
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === "invalid_date"
            ? "Please enter your date of birth."
            : defaultError,
      }),
      coerce: true,
    })
    .max(subYears(new Date(), 13), {
      message: "You must be at least 13 years old.",
    }),
  phoneNumber: z
    .string({ message: "Please enter your phone number." })
    .min(1, { message: "Please enter your phone number." }),
  avatar: avatarSchema,
});

export default accountSchema;

export type AccountSchema = z.infer<typeof accountSchema>;
