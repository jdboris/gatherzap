import { z } from "zod";
import { subYears } from "date-fns";
import avatarSchema from "./avatar-schema";

const accountUpdateSchema = z.object({
  fullName: z
    .string({
      message: "Please enter your full name.",
    })
    .min(1, { message: "Please enter your full name." }),
  birthDate: z.coerce
    .date({
      message: "Please enter your date of birth.",
      // NOTE: The following is still broken (see: https://github.com/colinhacks/zod/issues/1526)
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
  avatar: avatarSchema,
});

export default accountUpdateSchema;

export type AccountUpdateSchema = z.infer<typeof accountUpdateSchema>;
