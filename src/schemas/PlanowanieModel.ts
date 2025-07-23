import { z } from 'zod';
import { WorkerScheduleExtSchema } from './common/WorkerScheduleExt';

export const PlanowanieModelSchema = z.object({
    // Dodaj w�a�ciwo�ci specyficzne dla planowania
    // Na podstawie kodu wydaje si� by� zwi�zane z planowanymi czasami
    Schedule: z.array(WorkerScheduleExtSchema).nullable().default([]),
});

export type PlanowanieModel = z.infer<typeof PlanowanieModelSchema>;