import { z } from 'zod';

export const ActivityProgressSchema = z.object({
    IdActivity: z.number(),
    ActivityName: z.string(),
    ActivityNumber: z.number(),
    IdOrder: z.number(),
    IdDetail: z.number(),
    OrderName: z.string(),
    DetailName: z.string(),
    OrderNumber: z.number(),
    DetailNumber: z.number(),
    IsLockedOrder: z.boolean().optional(),
    IsActive: z.boolean().optional(),
    IsLocked: z.boolean().optional(),
    IdBulk: z.number().nullable().optional(),
});

export type ActivityProgress = z.infer<typeof ActivityProgressSchema>;