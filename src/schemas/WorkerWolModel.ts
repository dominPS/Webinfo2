import { z } from 'zod';

export const WorkerWolModelSchema = z.object({
    ComputerMAC: z.string().nullable().default(''),
    ComputerName: z.string().nullable().default(''),
});

export type WorkerWolModel = z.infer<typeof WorkerWolModelSchema>;