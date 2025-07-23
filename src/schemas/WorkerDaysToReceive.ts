import { z } from 'zod';
import { WorkerScheduleExtSchema } from './common/WorkerScheduleExt';

export const WorkerDaysToReceiveSchema = z.object({
    WorkerIndicatesDay: z.boolean(),
    WorkerIndicatesDayString: z.string().optional(),
    Message: z.string().nullable().default(''),
    Schedule: z.array(WorkerScheduleExtSchema).nullable().default([]),
    IndicatedDays: z.array(WorkerScheduleExtSchema).nullable().default([]),
    ReceiveDate: z.string().transform(val => new Date(val)).nullable().optional(),
    WeekForth: z.number().optional(),
    FullMonths: z.number().optional(),
    DayBack: z.number().optional(),
    IdWorker: z.number().optional(),
    ManageMode: z.boolean().optional().default(false),
});

export type WorkerDaysToReceive = z.infer<typeof WorkerDaysToReceiveSchema>;