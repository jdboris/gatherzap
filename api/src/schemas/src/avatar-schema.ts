import { z } from "zod";

// Matches DiceBear "Big Ears"
const avatarSchema = z.object({
  cheek: z.string().nullable(),
  ear: z.string(),
  eyes: z.string(),
  face: z.string(),
  frontHair: z.string().nullable(),
  hair: z.string().nullable(),
  hairColor: z.string(),
  mouth: z.string(),
  nose: z.string(),
  sideburn: z.string().nullable(),
  skinColor: z.string(),
});

export default avatarSchema;

export type AvatarSchema = z.infer<typeof avatarSchema>;
