import { z } from 'zod';

export const Settlement2Schema = z.object({
    Date: z.string().transform(val => new Date(val)),
    DayType: z.number(),
    DayTypeAbsence: z.string().nullable().optional(),
    In: z.string().nullable().optional(),
    Out: z.string().nullable().optional(),
    AbsenceCode: z.string().nullable().optional(),
    AbsenceDesc: z.string().nullable().optional(),
});

export type Settlement2 = z.infer<typeof Settlement2Schema>;