import { z } from 'zod';
import { WorkerScheduleExtSchema } from './common/WorkerScheduleExt';

export const PlanowanieModelSchema = z.object({
    // Dodaj w³aœciwoœci specyficzne dla planowania
    // Na podstawie kodu wydaje siê byæ zwi¹zane z planowanymi czasami
    Schedule: z.array(WorkerScheduleExtSchema).nullable().default([]),
});

export type PlanowanieModel = z.infer<typeof PlanowanieModelSchema>;