import { z } from 'zod';

export const VacancyRequestSchema = z.object({
    ID: z.number(),
    DateFrom: z.string().transform(val => new Date(val)),
    DateTo: z.string().transform(val => new Date(val)),
    DateToHourly: z.string().transform(val => new Date(val)),
    IdAbsence: z.number(),
    RType: z.number(), // PolsystemRequestType enum
    IsHourlyAbsence: z.boolean(),
});

export type VacancyRequest = z.infer<typeof VacancyRequestSchema>;