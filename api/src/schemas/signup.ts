import { z } from "zod";
import { subYears } from "date-fns";

const signupSchema = z.object({
  fullName: z
    .string({
      message: "Please enter your full name.",
    })
    .min(1, { message: "Please enter your full name." }),
  birthDate: z
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
    })
    .max(subYears(new Date(), 13), {
      message: "You must be at least 13 years old.",
    }),
  // NOTE: Validated by Clerk
  phoneNumber: z
    .string({ message: "Please enter your phone number." })
    .min(1, { message: "Please enter your phone number." }),
  password: z
    .string({ message: "Please enter a password." })
    .min(8, { message: "Password too short (8+ character minimum)." }),
});

export default signupSchema;

export type SignupSchema = z.infer<typeof signupSchema>;

const partial = signupSchema.partial();

export type PartialSignupSchema = z.infer<typeof partial>;
