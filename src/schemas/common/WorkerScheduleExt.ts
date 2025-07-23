import { z } from 'zod';

export const WorkerScheduleExtSchema = z.object({
    Date: z.string().transform(val => new Date(val)),
    DayType: z.number(),
    DayTypeExt: z.string().nullable().optional(),
    DayTypeAbsence: z.string().nullable().optional(),
    DayTypeAbsenceShort: z.string().nullable().optional(),
    AbsenceCode: z.string().nullable().optional(),
    IsWorking: z.boolean().optional(),
    IsCoreTime: z.boolean().optional(),
    IsAllowedTime: z.boolean().optional(),
    IsScheduledWorkingDay: z.boolean().optional(),
    IsStartDayBefore: z.boolean().optional(),
    ScheduleText: z.string().nullable().optional(),
    ScheduleFrom: z.string().nullable().optional(),
    ScheduleTo: z.string().nullable().optional(),
    ScheduleAllowedFrom: z.string().nullable().optional(),
    ScheduleAllowedTo: z.string().nullable().optional(),
    ScheduleFromDate: z.string().transform(val => new Date(val)).optional(),
    ScheduleToDate: z.string().transform(val => new Date(val)).optional(),
    ScheduleAllowedFromDate: z.string().transform(val => new Date(val)).optional(),
    ScheduleAllowedToDate: z.string().transform(val => new Date(val)).optional(),
    Absence: z.object({
        ID: z.number(),
        Name: z.string(),
        Description: z.string(),
        IdAbsenceType: z.number(),
    }).nullable().optional(),
    AllowRemove: z.boolean().optional(),
});

export type WorkerScheduleExt = z.infer<typeof WorkerScheduleExtSchema>;