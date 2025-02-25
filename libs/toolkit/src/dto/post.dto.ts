import { z } from "zod";
export const postDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  categories:  z.array(
    z.object({
    name:z.string(),
  })),
  content: z.array(
    z.object({   
          text: z.string(),
          bold: z.boolean().optional(),
          italic: z.boolean().optional(),
          underline: z.boolean().optional(),
        })
      ),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PostDto = z.infer<typeof postDtoSchema>;
