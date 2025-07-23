import { z } from 'zod';

export const DetailSchema = z.object({
    IdDetail: z.number(),
    DetailName: z.string(),
    DetailNumber: z.number(),
    IdOrder: z.number(),
    OrderNumber: z.number(),
    IsAvailable: z.boolean(),
});

export type Detail = z.infer<typeof DetailSchema>;