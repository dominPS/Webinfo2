import { z } from 'zod';

export const OrderSchema = z.object({
    IdOrder: z.number(),
    OrderName: z.string(),
    OrderNumber: z.number(),
    IsAvailable: z.boolean(),
});

export type Order = z.infer<typeof OrderSchema>;