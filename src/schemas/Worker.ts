import { z } from 'zod';

export const WorkerSchema = z.object({
    ID: z.number(),
    Badge: z.number(),
    Name: z.string(),
    Surname: z.string(),
    Nick: z.string().nullable().default(''),
    LogicCard: z.number().nullable().default(-1),
    PhysicCard: z.number().nullable().default(-1),
    Department: z.string().nullable().default(''),
    Group: z.string().nullable().default(''),
    Position: z.string().nullable().default(''),
    CostCenter: z.string().nullable().default(''),
    NIP: z.string().nullable().default(''),
    WorkGroup: z.string().nullable().default(''),
});

export type Worker = z.infer<typeof WorkerSchema>;