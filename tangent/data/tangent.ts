import { z } from "zod";

// 1) Define your schema once
export const TangentDataSchema = z.object({
  description: z.string(),
  tangent: z.array(
    z.object({
      title:   z.string(),
      content: z.string(),
    })
  )
});

// 2) Infer the TS type from it
export type TangentData = z.infer<typeof TangentDataSchema>;
