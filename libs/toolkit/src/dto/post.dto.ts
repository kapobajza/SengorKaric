import { z } from "zod";
export const postDtoSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  content: z.array(
    z.object({
      type: z.string().optional(),
      level: z.number().optional(), 
      format: z.string().optional(), 
      children: z.array(
        z.object({
          text: z.string().optional(),
          type: z.string().optional(),
          bold: z.boolean().optional(),
          italic: z.boolean().optional(),
          underline: z.boolean().optional(),
        })
      ),
    })
  ),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PostDto = z.infer<typeof postDtoSchema>;
