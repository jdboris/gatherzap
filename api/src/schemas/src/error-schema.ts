import { z } from "zod";

const errorSchema = z.object({
  message: z.string().min(1),
});

export default errorSchema;

export type ErrorSchema = z.infer<typeof errorSchema>;
