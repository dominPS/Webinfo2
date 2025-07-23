import { z } from 'zod';

export const ActivitySchema = z.object({
    IdActivity: z.number(),
    ActivityName: z.string(),
    ActivityNumber: z.number(),
    IdOrder: z.number(),
    IdDetail: z.number(),
    OrderNumber: z.number(),
    DetailNumber: z.number(),
    FullName: z.string(),
    IsAvailable: z.boolean(),
});

export type Activity = z.infer<typeof ActivitySchema>;