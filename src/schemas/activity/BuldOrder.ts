import { z } from 'zod';
import { ActivityProgressSchema } from './ActivityProgress';

export const BuldOrderSchema = z.object({
    Id: z.number(),
    GroupName: z.string(),
    IsActive: z.boolean(),
    Activities: z.array(ActivityProgressSchema).nullable().default([]), // Zmieniono na nullable
});

export type BuldOrder = z.infer<typeof BuldOrderSchema>;